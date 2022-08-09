//This file handles GET and POST REQUESTS
const router = require('express').Router();
const passport = require('passport');
const connection = require('../mongoose-setup');
const User = connection.models.User;
const genPassword = require('../password-encryption').genPassword;
const isAuth = require('./auth-logic').isAuth;
// const googleAuth = require('./auth-logic').googleAuth;

//POST ROUTES
router.post('/register', (req, res, next) => {
  const saltHash = genPassword(req.body.password);
  const salt = saltHash.salt
  const hash = saltHash.hash;

  const newUser = new User({
    username: req.body.username,
    hash: hash,
    salt: salt
  });
  //save needs to be a promise now so you need to add .then
  newUser.save()
    .then((user) => {});
  res.redirect('/login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/secrets'
}));

// GET ROUTES
router.get('/', (req, res) => {
  res.render('home');
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

router.get('/auth/google', passport.authenticate('google', {
  scope: ['profile']
}));

router.get('/auth/google/secrets', passport.authenticate('google', {
  failureRedirect: '/login',
  successRedirect: '/secrets'
}));

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/secrets', passport.authenticate('facebook', {
  failureRedirect: '/login',
  successRedirect: '/secrets'
}));

router.get('/submit', isAuth, (req, res, next) => {
  res.render('submit');
});

module.exports = router;
