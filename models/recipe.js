const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: String,
  submittedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  image: String,
  cuisine: String,
  ingredients: String,
  prepHrs: String,
  prepMins: String,
  directions: String,
  description: String,
  allergies: String,
});

module.exports = mongoose.model('Recipe', RecipeSchema);
