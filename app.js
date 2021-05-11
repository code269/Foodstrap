if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');
const methodOverride = require('method-override');
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/foodstrap';
const LocalStrategy = require('passport-local');
const session = require('express-session');
const passport = require('passport');
const User = require('./models/user');
const { getMaxListeners } = require('./models/recipe');
// const morgan = require('morgan');

// app.use(morgan('tiny'));

//'mongodb://localhost:27017/foodstrap'

mongoose.connect(dbURL, {
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

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/login');
  }
  next();
};

//Session
const sessionConfig = {
  secret: 'iliketoeathalal',
  resave: false,
  saveUnitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));

//Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', async (req, res) => {
  const recipes = await Recipe.find({});
  res.render('home', { recipes });
});

//Auth start
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', passport.authenticate('local'), (req, res) => {
  try {
    console.log('Successfully logged in!');
    res.redirect('/');
  } catch (e) {
    console.log(e);
    res.redirect('/login');
  }
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post('/signup', async (req, res) => {
  const { email, password, username } = req.body;
  const user = new User({ email, username });
  const registeredUser = await User.register(user, password);
  console.log(registeredUser);
  res.redirect('/');
});
//Auth end

//?Search request
app.get('/search/', async (req, res) => {
  const recipes = await Recipe.find({});
  console.log(recipes);
  console.log(req.params.q);
  res.render('search', { recipes });
});

//?Filter request
app.get('/filterCuisine/:cuisine', async (req, res) => {
  const recipes = await Recipe.find({
    cuisine: req.params.cuisine,
  });
  res.render('filter', { recipes });
});

app.get('/filterAllergies/:allergies', async (req, res) => {
  const recipes = await Recipe.find({
    allergies: { $ne: req.params.allergies },
  });
  res.render('filter', { recipes });
});

//Show Page
app.get('/recipes/:id', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('show', { recipe });
});

app.get('/recipes/:id/edit', async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.render('editPost', { recipe });
});

app.get('/new', isLoggedIn, (req, res) => {
  res.render('newPost');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.post('/newRecipe', async (req, res) => {
  const recipe = new Recipe(req.body.newRecipe);
  recipe.submittedBy = req.user;
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

//404 Route
app.use((req, res) => {
  res.status(404).render('404');
});

//Decides either Heroku or local machine port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
