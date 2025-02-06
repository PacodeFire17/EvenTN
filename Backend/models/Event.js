var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
const dateSchema = new mongoose.Schema({
    day: Number,
    month: Number,
    year: Number,
    hour: Number,
    minutes: Number
});
      
const locationSchema = new mongoose.Schema({
    lat: Number,
    lng: Number,
    address: String
});
      
const eventSchema = new mongoose.Schema({
    name: String,
    startDate: dateSchema,
    endDate: dateSchema,
    location: locationSchema,
    maxSeats: Number,
    bookedSeats: Number,
    description: String,
    image: String,
    needBooking: Boolean,
    tags: [String],
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'user'},
    approved: Boolean,
    bookings: { type: [mongoose.Schema.Types.ObjectId], ref: 'booking' },
    resources: String,
    self: String
});

module.exports=mongoose.model('event',eventSchema);
