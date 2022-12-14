const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./mongoose-setup');
const User = connection.models.User;
const validPassword = require('./password-encryption').validPassword;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const findOrCreate = require('mongoose-findorcreate');
const FacebookStrategy = require('passport-facebook').Strategy

//                     GOOGLE STRATEGY
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;


passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/secrets'
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile);
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

//                     FACEBOOK STRATEGY
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:3000/auth/facebook/secrets'
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));



const customFields = {
  username: 'username',
  password: 'password'
};

const verifyCallback = (username, password, next) => {
  User.findOne({
      username: username
    })
    .then((user) => {
      if (!user) {
        next(null, false)
      }
      const isValid = validPassword(password, user.hash, user.salt);
      if (isValid) {
        next(null, user)
      } else {
        next(null, false)
      }
    })
    .catch((err) => {
      next(err)
    })
};

const strategy = new LocalStrategy(customFields, verifyCallback);

passport.use(strategy);

passport.serializeUser((user, next) => {
  next(null, user.id)
});

passport.deserializeUser((userId, next) => {
  User.findById(userId)
    .then((user) => {
      next(null, user)
    })
    .catch(err => next(err))
});
