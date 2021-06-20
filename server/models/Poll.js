const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PollSchema = new Schema({
  title: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  description: { type: String, default: '', maxlength: 40000 },
  pollOptions: {
    type: [Schema.Types.Mixed],
    required: true,
    minlength: 1,
    maxlength: 25,
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  isPrivate: { type: Boolean, default: false },
});

PollSchema.virtual('interactionCount').get(function () {
  let total = 0;
  this.pollOptions.forEach((option) => {
    total += option.userVotes.length + option.annonymousVotes.length;
  });
  return total;
});

module.exports = mongoose.model('Poll', PollSchema);
