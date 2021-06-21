const { body } = require('express-validator');
const Comment = require('../models/Comment');
const Poll = require('../models/Poll');
const User = require('../models/User');

exports.getComment = async function (req, res, next) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'No Comment Found' });
    return res.send(comment);
  } catch (err) {
    return next(err);
  }
};

exports.postRootComment = [
  body('body').trim().escape(),

  async function (req, res, next) {
    try {
      const poll = await Poll.findById(req.params.pollId);
      if (!poll) return res.stats(404).json({ error: 'Invalid Poll Id' });

      const commentAuthor = await User.findById(req.body.userId);
      const comment = new Comment({
        authorName: commentAuthor.username,
        body: req.body.commentBody,
        pollTitle: poll.title,
      });

      commentAuthor.commentHistory.push(comment);
      poll.comments.push(comment);

      commentAuthor.save();
      Promise.all([comment.save(), poll.save()]).then(() => {
        return res.send();
      });
    } catch (err) {
      return next(err);
    }
  },
];

exports.deleteComment = async function (req, res, next) {
  try {
    const comment = await Comment.findById(req.body.commentId);
    const author = await User.findById(req.body.userId);
    if (!comment || !author || comment.authorName != author.username) {
      return res.status(403).json({ error: 'Invalid Delete Request' });
    }
    let index = author.commentHistory.findIndex((pastComment) => {
      return comment.equals(pastComment);
    });

    author.commentHistory.splice(index, 1);
    author.save();

    comment.body = 'Comment Deleted by author';
    comment.authorName = 'Deleted';
    comment.save(() => {
      return res.send('comment successfully deleted');
    });
  } catch (err) {
    return next(err);
  }
};

exports.editComment = async function (req, res, next) {
  try {
    const comment = await Comment.findById(req.params.commentId);
    const author = await User.findById(req.body.userId);
    if (comment.authorName != author.username) {
      return res
        .status(403)
        .json({ error: 'User is not authorized to edit this comment' });
    }
    comment.body = req.body.revisedComment;
    comment.save().then(() => {
      return res.send('comment successfully revised');
    });
  } catch (err) {
    return next(err);
  }
};

exports.reply = async function (req, res, next) {
  try {
    const parentComment = await Comment.findById(req.params.commentId);
    const author = await User.findById(req.body.userId);

    const newComment = new Comment({
      authorName: author.username,
      body: req.body.commentBody,
      pollTitle: parentComment.pollTitle,
    });

    author.commentHistory.push(newComment);
    parentComment.replies.push(newComment);

    Promise.all([author.save(), parentComment.save(), newComment.save()]).then(
      () => {
        return res.send('Success');
      }
    );
  } catch (err) {
    return next(err);
  }
};

exports.upvote = async function (req, res, next) {
  try {
    const user = await User.findById(req.body.userId);
    const comment = await Comment.findById(req.body.commentId);
    if (!user || !comment)
      return res.status(401).json({ error: 'Invalid Reply' });
    comment.upvotes.push(user.username);
    comment.save((err) => {
      if (err) return next(err);

      return res.send();
    });
  } catch (err) {
    return next(err);
  }
};

exports.removeUpvote = async function (req, res, next) {
  try {
    const user = await User.findById(req.body.userId);
    const comment = await Comment.findById(req.body.commentId);
    if (!user || !comment)
      return res.status(401).json({ error: 'Invalid Reply' });

    let index = comment.upvotes.findIndex((upvote) => {
      return upvote == user;
    });
    comment.upvotes.splice(index, 1);
    comment.save((err) => {
      if (err) return next(err);

      return res.send('Sucessfully Removed Upvote');
    });
  } catch (err) {
    return next(err);
  }
};
