const express = require('express');
const bookModel = require('../../models/bookings');
const eventModel = require('../../models/Event');
const router = express.Router({mergeParams:true});

// tutti i metodi per /users/:id

router.get('/bookings',async (req,res)=>{
    if(req.params.id != req.loggedUser.id) res.status(401).send('user not authenticated');
    else if(req.loggedUser.role != 'citizen') res.status(400).send('not a citizen');
    else{
        const bookings = await bookModel.find({citizenId: req.loggedUser.id}).populate('eventId').exec();
        let retV = [];
        if(bookings)
            bookings.map((booking)=>{
                                        retV.push({howMany: booking.howMany,
                                        eventName: booking.eventId.name,
                                        startDate: booking.eventId.startDate,
                                        endDate: booking.eventId.endDate,
                                        location: booking.eventId.location,
                                        description: booking.eventId.description,
                                        image: booking.eventId.image,
                                        tags: booking.eventId.tags})
                                    });
        res.status(200).json(retV);
    }
});

router.get('/events',async(req,res)=>{
    if(req.loggedUser.role != 'organization' || req.loggedUser.id != req.params.id) res.status(401).send('user not authenticated');
    else {
        let dbVal = await eventModel.find({organizerId:req.params.id}).exec();
        if (!dbVal) res.status(404).send('resource not found');
        else {
            let retV = [];
            dbVal.map((org)=>retV.push(org));
            res.status(200).json(retV);
        }
    }
});

module.exports = router;