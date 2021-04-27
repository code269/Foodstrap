const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  cuisine: String,
  prepTime: Number,
  description: String,
});

module.exports = mongoose.model('Recipe', RecipeSchema);
