var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// set up a mongoose model
module.exports = mongoose.model('User', new Schema({ 

    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'organization', 'townhall'], required: true },
    self: { type: String }
  }));
  
  module.exports = mongoose.model('User', userSchema);
  