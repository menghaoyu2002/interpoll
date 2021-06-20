const Poll = require('../models/Poll');
const User = require('../models/User');
const Comment = require('../models/Comment');
const { PollOption } = require('../models/PollOption');

const { body, validationResult } = require('express-validator');

// Get list of Polls
exports.pollList = function (req, res, next) {
  Poll.find({ isPrivate: false })
    .populate('author')
    .batchSize(25)
    .sort([['uploadDate', 'descending']])
    .exec(function (err, pollList) {
      if (err) return next(err);

      pollList.forEach((poll) => {
        if (poll.author) {
          poll.author.password = undefined;
          poll.author.email = undefined;
        }
      });

      return res.send(pollList);
    });
};

exports.getExistingPoll = async function (req, res, next) {
  Poll.findById(req.params.pollId)
    .populate('author')
    .populate('comments')
    .exec(function (err, poll) {
      if (err) {
        return err.name === 'CastError'
          ? res.status(404).json({ error: 'Invalid Poll Id' }) // handle error later
          : next(err);
      }

      if (!poll) {
        return res.status(401).json({ error: 'Poll not found' });
      }

      if (poll.author) {
        poll.author.email = undefined;
        poll.author.password = undefined;
      }
      res.send(poll);
    });
};

// Create a new poll
exports.createNewPoll = [
  // sanitize input
  body('title')
    .trim()
    .isLength({ min: 1, max: 300 })
    .escape()
    .withMessage('Poll title must be between 1-300 characters'),
  body('description')
    .isLength({ min: 0, max: 40000 })
    .escape()
    .withMessage('Description must be between 1-40,000 characters long'),
  body('pollOptions')
    .isLength({ min: 1, max: 25 })
    .withMessage('Poll must have 1 - 25 options to pick from'),

  async function (req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send({ error: errors.array() });
    } else {
      var author;
      if (req.body.userId) {
        author = await User.findById(req.body.userId);
        if (!author) return res.status(401).json({ error: 'invalid author' });
      }

      const poll = new Poll({
        title: req.body.title,
        description: req.body.description,
        author: author,
        pollOptions: [],
        selectMultiple: req.body.selectMultiple,
        isPrivate: req.body.isPrivate,
      });

      if (req.body.userId) {
        author.createdPolls.push(poll);
        author.save(function (err) {
          if (err) return next(err);
        });
      }

      let pollOptions = [];
      req.body.pollOptions.forEach((option) => {
        let pollOption = new PollOption(option, poll._id, poll.title);
        pollOptions.push(pollOption);
      });
      poll.pollOptions = pollOptions;

      poll.save(function (err) {
        if (err) return next(err);
        res.json({ pollId: poll._id });
      });
    }
  },
];

exports.deletePoll = async function (req, res, next) {
  try {
    const poll = await Poll.findById(req.body.pollId)
      .populate('author')
      .populate('comments');
    if (!poll || poll.author._id != req.body.userId) {
      res.status(401).json({ error: 'Unauthroized Delete Request' });
    }

    let index = poll.author.createdPolls.findIndex((createdPoll) => {
      return createdPoll == poll;
    });
    poll.author.createdPolls.splice(index, 1);
    poll.author.save();

    poll.comments.forEach((comment) => {
      deleteComment(comment, next);
    });

    poll.pollOptions.forEach((option) => {
      option.userVotes.forEach((username) => {
        User.findOne({ username: username }).then(async (user) => {
          if (user) {
            const i = user.pollHistory.findIndex((vote) => {
              return vote.pollId.equals(option.pollId);
            });

            user.pollHistory.splice(i, 1);
            await User.findOneAndUpdate(
              { _id: user._id },
              { pollHistory: user.pollHistory }
            );
          }
        });
      });
    });

    Poll.findByIdAndRemove(req.body.pollId, function () {
      return res.send('Success');
    });
  } catch (err) {
    return next(err);
  }
};

// Recusive helper function
async function deleteComment(comment, next) {
  const author = await User.findOne({ username: comment.authorName }).populate(
    'commentHistory'
  );

  let index = author.commentHistory.findIndex((pastComment) => {
    return comment.equals(pastComment);
  });
  author.commentHistory.splice(index, 1);
  await User.findOneAndUpdate(
    { _id: author._id },
    { commentHistory: author.commentHistory }
  );

  Comment.findByIdAndRemove(comment._id, function (err) {
    if (err) return next(error);
  });

  comment.replies.forEach(async (replyId) => {
    const reply = await Comment.findById(replyId).populate('replies');
    deleteComment(reply, next);
  });
}

exports.vote = async function (req, res, next) {
  try {
    const poll = await Poll.findById(req.body.pollId);
    if (!poll) return res.status(401).json({ error: 'Poll Not Found' });

    let index = poll.pollOptions.findIndex((option) => {
      return option.optionName === req.body.optionName;
    });

    const voteOption = poll.pollOptions[index];
    if (req.body.userId) {
      const user = await User.findById(req.body.userId);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      if (!voteOption.userVotes.includes(user.username)) {
        // Remove existing votes if not select multiple
        poll.pollOptions.forEach((option) => {
          if (option.userVotes.includes(user.username)) {
            let i = option.userVotes.findIndex((username) => {
              return username === user.username;
            });
            option.userVotes.splice(i, 1);
            i = user.pollHistory.findIndex((vote) => {
              return vote.pollId === option.pollId;
            });

            user.pollHistory.splice(i, 1);
          }
        });
        voteOption.userVotes.push(user.username);
        user.pollHistory.push(voteOption);
        user.save();
      }
    } else {
      const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
      if (!voteOption.annonymousVotes.includes(ip)) {
        poll.pollOptions.forEach((option) => {
          if (option.annonymousVotes.includes(ip)) {
            let i = option.annonymousVotes.findIndex((existingIp) => {
              return existingIp === ip;
            });
            option.annonymousVotes.splice(i, 1);
          }
        });
        voteOption.annonymousVotes.push(ip);
      }
    }

    poll.markModified('pollOptions');
    poll.save(function (err) {
      if (err) return next(err);
      return res.send();
    });
  } catch (err) {
    return next(err);
  }
};

exports.editPoll = async function (req, res, next) {
  try {
    const poll = await Poll.findById(req.params.pollId);
    const author = await User.findById(req.body.userId);
    if (!poll.author.equals(author._id)) {
      return res
        .status(403)
        .json({ error: 'User is not authorized to edit this comment' });
    }

    poll.title = req.body.title;
    poll.description = req.body.description;
    poll.pollOptions = req.body.pollOptions.map(
      (optionName) => new PollOption(optionName, poll._id, poll.title)
    );
    poll.isPrivate = req.body.isPrivate;
    poll.save();
    return res.send('comment successfully revised');
  } catch (err) {
    return next(err);
  }
};
