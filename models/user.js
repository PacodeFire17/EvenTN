var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// set up a mongoose model
const userSchema = new mongoose.Schema({

    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'organization', 'townhall'], required: true },
    self: { type: String }
  });
  
  module.exports = mongoose.model('User', userSchema);
  