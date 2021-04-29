const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

mongoose.connect('mongodb://localhost:27017/foodstrap', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Connection Error:'));
db.once('open', () => {
  console.log('Successfully connected database!');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Parsing body
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
  const recipes = await Recipe.find({});
  res.render('home', { recipes });
});

app.get('/recipes/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('posts/showRecipe', { recipe });
});

app.get('/new', (req, res) => {
  res.render('posts/newRecipe');
});

app.post('/newRecipe', async (req, res) => {
  const recipe = new Recipe(req.body.newRecipe);
  await recipe.save();
  res.redirect(`/recipes/${recipe._id}`);
});

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
