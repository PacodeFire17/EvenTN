var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const eventSchema=require('eventSchema')
const userSchema=require('userSchema')
// set up a mongoose model
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  howMany: { type: Number, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  self: { type: String }
});

module.exports = mongoose.model('Booking', bookingSchema);