const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  filename: String,
  originalFilename: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  path: String,
  size : Number
});

module.exports = mongoose.model('File', fileSchema);
