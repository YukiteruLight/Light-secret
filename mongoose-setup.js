require('dotenv').config()
const mongoose = require('mongoose');

// this is the ip adress mongoose connects to
const connectionIP = process.env.DB_STRING;

//this is the updated setting for mongoose, other stuff depricated
const connection = mongoose.createConnection(connectionIP, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String
});

//connects mongoose to your Schema
const User = connection.model('User', UserSchema);

module.exports = connection;
