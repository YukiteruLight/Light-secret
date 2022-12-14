//get all requirements out of the way
require('dotenv').config()
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const ejs = require('ejs');
const passport = require('passport');
const crypto = require('crypto');
const routes = require('./routes');
const connection = require('./mongoose-Setup')
const MongoStore = require('connect-mongo');
require('./passport')

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//this is the new way to us MongoStore
const sessionStore = MongoStore.create({
  mongoUrl: process.env.DB_STRING
})

//this is the session for the user, its server side, also has a cookie
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 //1 hour
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  console.log(req.session, req.user);
  next();
})



app.use(routes);

app.listen(3000, () => {
  console.log('listening on port 3000')
});
