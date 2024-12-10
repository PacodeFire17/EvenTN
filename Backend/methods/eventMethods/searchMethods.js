const express = require('express');
const type = require('./eventsearchword');
const tag = require('./eventsearchtag');
const router = express.Router({mergeParams: true});

// metodi /events/search

router.use('/type',type);
router.use('/tags',tag);

module.exports = router;