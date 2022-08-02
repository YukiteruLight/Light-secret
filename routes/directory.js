//This file handles GET and POST REQUESTS
const router = require('express').router();
const passport = require('passport');
const connection = require('../mongoose-setup');
const User = connection.models.User;
const genPassword = require('../password-encryption').genPassword;
const isAuth = require('./auth-logic');

//POST ROUTES

// GET ROUTES
router.get('/', (req, res) => {
  res.render('home')
});

module.exports = router;
