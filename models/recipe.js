const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  image: String,
  cuisine: String,
  ingredients: String,
  prepTime: String,
  directions: String,
  description: String,
  allergies: String,
});

module.exports = mongoose.model('Recipe', RecipeSchema);
