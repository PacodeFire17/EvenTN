const express = require('express');
const makeBooking = require('./makeBooking');
const deleteBooking = require('./deleteBooking');
const getBookings = require('./bookingList');
const router = express.Router({mergeParams:true});

//tutti i metodi riguardanti events/:id/bookings

router.get('',getBookings);
router.post('',makeBooking);
router.delete('',deleteBooking); 

module.exports = router;