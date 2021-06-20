var express = require('express');
var router = express.Router();
var pollController = require('../controllers/PollController');
var commentController = require('../controllers/CommentController');
var authController = require('../controllers/AuthController');

/* POST, create new poll */
router.post('/create', pollController.createNewPoll);

/* GET existing poll */
router.get('/:pollId', pollController.getExistingPoll);

/* DELETE existing poll */
router.delete(
  '/delete',
  authController.requireSignin,
  authController.hasAuthorization,
  pollController.deletePoll
);

router.post(
  '/edit/:pollId',
  authController.requireSignin,
  authController.hasAuthorization,
  pollController.editPoll
);

/* POST a vote on an existing poll */
router.post('/vote', pollController.vote);

/* POST a comment on an existing poll */
router.post(
  '/:pollId/comment',
  authController.requireSignin,
  authController.hasAuthorization,
  commentController.postRootComment
);

module.exports = router;
