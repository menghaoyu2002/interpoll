const User = require('../models/User');
const Comment = require('../models/Comment');
const Poll = require('../models/Poll');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: './config.env' });

exports.createNewUser = async function (req, res, next) {
  try {
    const user = new User(req.body);
    await user.save();
    return res.status(201).send('Success');
  } catch (err) {
    if (err.code === 11000) {
      if (err.message.includes('email')) {
        return res
          .status(409)
          .json({ error: 'User with this email already exists' });
      } else if (err.message.includes('username')) {
        return res.status(409).json({ error: 'This username is taken' });
      }
    }
    return next(err);
  }
};

exports.viewUser = async function (req, res, next) {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('commentHistory')
      .populate('createdPolls');
    if (!user) return res.status(401).json({ error: 'No User Found' });
    user.password = undefined;
    return res.json(user);
  } catch (err) {
    return next(err);
  }
};

exports.login = async function (req, res) {
  try {
    const user = await User.findUserByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) {
      return res.status(401).json({ error: 'Invalid Login Credentials' });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );
    return res.json({
      token,
      user: { _id: user._id, username: user.username },
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({ error: 'Could not sign in' });
  }
};

exports.deleteUser = async function (req, res, next) {
  const user = await User.findById(req.body.userId);
  const loginUser = await User.findUserByCredentials(
    req.body.email,
    req.body.password
  );

  if (loginUser.equals(user)) {
    user.commentHistory.forEach(async (commentId) => {
      let comment = await Comment.findById(commentId);
      comment.body = 'User Deleted';
      comment.author = undefined;
      comment.save();
    });

    user.createdPolls.forEach(async (pollId) => {
      let poll = await Poll.findById(pollId);
      poll.author = undefined;
      poll.save();
    });

    User.findByIdAndRemove(user._id, function (err) {
      if (err) return next(err);
      return res.send();
    });
  } else {
    return res.status(403).send({ error: 'user authetication failed' });
  }
};

exports.updateUser = async function (req, res, next) {
  try {
    const user = await User.findUserByCredentials(
      req.body.email,
      req.body.password
    );
    if (!user) return res.status(401).json({ error: 'Invalid Password' });

    const matching = await User.findOne(req.body.updatedElement);
    const keyName = Object.keys(req.body.updatedElement)[0];
    if (matching) {
      return res.status(412).json({
        error: 'User with this ' + keyName + ' already exists',
      });
    }

    if (keyName === 'password') {
      req.body.updatedElement = {
        password: await bcrypt.hash(req.body.updatedElement.password, 10),
      };
    }

    User.findByIdAndUpdate(user._id, req.body.updatedElement, {
      new: true,
    }).then((result) => {
      const token = jwt.sign(
        {
          _id: user._id,
        },
        process.env.JWT_SECRET
      );
      return res.json({
        token,
        user: { _id: result._id, username: result.username },
      });
    });
  } catch (err) {
    return next(err);
  }
};
