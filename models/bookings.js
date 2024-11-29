var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// set up a mongoose model

const bookingSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
  howMany: Number,
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'event'},
  self: String
});

module.exports = mongoose.model('booking', bookingSchema);