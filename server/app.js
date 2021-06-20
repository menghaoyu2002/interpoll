var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');

var homeRouter = require('./routes/home');
var pollRouter = require('./routes/polls');
var userRouter = require('./routes/user');
var commentRouter = require('./routes/comments');

var app = express();

// Set up mongoose connection
require('dotenv').config({ path: './config.env' });
var mongoose = require('mongoose');
mongoose.connect(
  process.env.MONGODB_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('Connected to MongoDB Database!')
);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/api/home', homeRouter);
app.use('/api/poll', pollRouter);
app.use('/api/user', userRouter);
app.use('/api/comment', commentRouter);

app.set('port', 3000);

app.listen(app.get('port'), (err) => {
  if (err) {
    console.log(err);
  }
  console.info('Server started on port %s.', app.get('port'));
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
