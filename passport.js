const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const connection = require('./mongoose-setup');
const User = connection.models.User;
const validPassword = require('./password-encryption').validPassword;

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
        next(null, user)
      }
      const isValid = validPassword(password);
      if (isValid) {
        next(null, user)
      } else {
        next(null, false)
      }
    })
    .catch(err => {
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
