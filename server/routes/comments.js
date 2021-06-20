var express = require('express');
var router = express.Router();
var commentController = require('../controllers/CommentController');
var authController = require('../controllers/AuthController');

router.get('/:commentId', commentController.getComment);

/* DELETE a comment */
router.delete(
  '/delete',
  authController.requireSignin,
  authController.hasAuthorization,
  commentController.deleteComment
);

/* POST an edit to a comment */
router.post(
  '/edit/:commentId',
  authController.requireSignin,
  authController.hasAuthorization,
  commentController.editComment
);

/* POST a reply to a comment */
router.post(
  '/:commentId/reply',
  authController.requireSignin,
  authController.hasAuthorization,
  commentController.reply
);

/* POST an upvote on a comment */
router.post(
  '/upvote',
  authController.requireSignin,
  authController.hasAuthorization,
  commentController.upvote
);

router.post(
  '/unvote',
  authController.requireSignin,
  authController.hasAuthorization,
  commentController.removeUpvote
);

module.exports = router;
