const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 32,
    minlength: 2,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  email: { type: String, required: true, unique: true },
  pollHistory: [Schema.Types.Mixed],
  commentHistory: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createdPolls: [{ type: Schema.Types.ObjectId, ref: 'Poll' }],
});

UserSchema.pre('save', async function (next) {
  var user = this;

  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

UserSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await User.findOne({ email: email });
  if (!user) return;

  const doesPasswordMatch = await bcrypt.compare(password, user.password);
  if (!doesPasswordMatch) return;

  return user;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
