var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model
const dateSchema = new mongoose.Schema({
    day: { type: Number, required: true },
    month: { type: Number, required: true },
    year: { type: Number, required: true },
    hour: { type: Number, required: true },
    minutes: { type: Number, required: true }
    });
      
    const locationSchema = new mongoose.Schema({
    via: { type: String, required: true },
    number: { type: Number, required: true },
    city: { type: String, required: true },
    CAP: { type: Number, required: true },
    region: { type: String, required: true },
    country: { type: String, required: true }
    });
      
    const eventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    startDate: { type: dateSchema, required: true },
    endDate: { type: dateSchema, required: true },
    location: { type: locationSchema, required: true },
    maxSeats: { type: Number, required: true },
    bookedSeats: { type: Number, default: 0 },
    description: { type: String },
    needBooking: { type: Boolean, required: true },
    tags: { type: [String] },
    organizerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    approved: { type: Boolean, default: false },
    bookings: { type: [mongoose.Schema.Types.ObjectId], ref: 'Booking' },
    resources: { type: String },
    self: { type: String }
    });
module.exports=eventSchema;
