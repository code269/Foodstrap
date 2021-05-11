const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  sender: String,
  message: String,
});
