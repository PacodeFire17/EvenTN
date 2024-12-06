var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// set up a mongoose model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String,
  salt: String,
  self: String
});
  
module.exports = mongoose.model('user', userSchema);