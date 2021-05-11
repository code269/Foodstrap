const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');
const methodOverride = require('method-override');
// const morgan = require('morgan');

// app.use(morgan('tiny'));

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

//For image routing
app.use(express.static(path.join(__dirname, 'public')));
//Favicon fetch
// app.use('/logo.png', express.static('images/logo.png'));
//Parsing body
app.use(express.urlencoded({ extended: true }));
//Method override for HTTP
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const recipes = await Recipe.find({});
  // res.render('home', { recipes });
  res.render('home', { recipes });
});

//?Search request
app.get('/search/?:query', async (req, res) => {
  const recipes = await Recipe.find({ title: 'Kani' });
});

app.get('/search', (req, res) => {
  res.render('search');
});

//?Filter request
app.get('/filter', async (req, res) => {});

//Show Page
app.get('/recipes/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('show', { recipe });
});

app.get('/recipes/:id/edit', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('editPost', { recipe });
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.get('/new', (req, res) => {
  res.render('newPost');
});

app.post('/newRecipe', async (req, res) => {
  const recipe = new Recipe(req.body.newRecipe);
  await recipe.save();
  res.redirect(`/recipes/${recipe._id}`);
});

app.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const updatedRecipe = await Recipe.findByIdAndUpdate(id, {
    ...req.body.newRecipe,
  });
  res.redirect(`/recipes/${updatedRecipe._id}`);
});

app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  await Recipe.findByIdAndDelete(id);
  res.redirect('/');
});

// //404 Route
// app.use((req, res) => {
//   res.status(404).send('404 Not Found!');
// });

app.listen(3000, () => {
  console.log('Listening on port 3000...');
});
