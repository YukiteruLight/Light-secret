//This file handles GET and POST REQUESTS
const router = require('express').Router();
const passport = require('passport');
const passportMongoose = require("passport-local-mongoose");
const connection = require('../mongoose-setup');
const User = connection.models.User;
const genPassword = require('../password-encryption').genPassword;
const isAuth = require('./auth-logic').isAuth;

//POST ROUTES
router.post('/register', (req, res, next) => {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });

  User.plugin(passportMongoose)

  newUser.save()
    .then((user) => {});
  res.redirect('/login');
});

// GET ROUTES
router.get('/', (req, res) => {
  res.render('home')
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.get('/secrets', isAuth, (req, res, next) => {
  res.render('secrets')
});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err)
    }
  });
  res.redirect('/');
});

router.get('/submit', isAuth, (req, res, next) => {
  res.render('submit');
});

module.exports = router;
