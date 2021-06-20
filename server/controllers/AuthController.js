var expressJwt = require('express-jwt');
require('dotenv').config({ path: './config.env' });

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: 'auth',
  algorithms: ['HS256'],
});

exports.hasAuthorization = (req, res, next) => {
  const authorized =
    req.body.userId && req.auth && req.body.userId == req.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized to perform this action',
    });
  }
  next();
};
