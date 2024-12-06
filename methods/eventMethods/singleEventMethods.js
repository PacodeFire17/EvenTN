const express = require('express');
const tokenChecker = require('../tokenChecker');
const approveEvent = require('./approvesEvent');
const deleteEvent = require('./deleteEvent');
const infoEvent = require('./infoEvent');
const bookings = require('../bookingMethods/bookingMethods');
const router = express.Router({mergeParams: true});

// i metodi con /events/:id ad eccezzione delle prenotazioni dovrebbero essere visibili solo a organizzazioni e operatori perchè sono più organizzative

router.use('/bookings',bookings);
router.get('',infoEvent);
router.delete('',deleteEvent);
router.put('',approveEvent);

module.exports = router;