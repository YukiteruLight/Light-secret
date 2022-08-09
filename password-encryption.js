// I using crypto in this version because it's native to nodejs
// I will redo this project with bcrypt or argon2 in another version of this
const crypto = require('crypto');

// this generates our hash and salted string taking in password as an input
//it returs an obj containing salt that was used and the hash generated
// it does not save the password in database
const genPassword = (password) => {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  };
};

//this takes in the password, hash and salt from obj above
// applies them and compares them returning boolean
const validPassword = (password, hash, salt) => {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
};

module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
