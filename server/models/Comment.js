const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CommentSchema = new Schema({
  authorName: { type: String },
  body: { type: String, required: true, maxlength: 40000 },
  replies: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  upvotes: [String],
  uploadDate: { type: Date, default: Date.now },
  pollTitle: { type: String, required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
