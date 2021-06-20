const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');
const express = require('express');
const router = express.Router();

/* GET an existing User */
router.get('/:username', userController.viewUser);

router.post('/login', userController.login);

router.post('/register', userController.createNewUser);

router.post(
  '/update',
  authController.requireSignin,
  authController.hasAuthorization,
  userController.updateUser
);

router.delete(
  '/delete',
  authController.requireSignin,
  authController.hasAuthorization,
  userController.deleteUser
);

module.exports = router;
