const express = require('express');
const bookModel = require('../../models/bookings');
const eventModel = require('../../models/Event');
const router = express.Router({mergeParams:true});

// tutti i metodi per /users/:id

router.get('/bookings',async (req,res)=>{

    if(req.params.id != req.loggedUser.id) return res.status(401).json({message: 'Utente non autenticato.'});

    if(req.loggedUser.role !== 'citizen') return res.status(400).json({message: 'L\'utente '+req.loggedUser.role+' non può avere prenotazioni'});
    
    const bookings = await bookModel.find({citizenId: req.loggedUser.id}).populate({path: 'eventId', populate: { path: 'organizerId' }}).exec();
    let retV = [];
    if(bookings)
        bookings.map((booking)=>retV.push({howMany: booking.howMany,
                                            eventId: booking.eventId,
                                            eventName: booking.eventId.name,
                                            startDate: booking.eventId.startDate,
                                            endDate: booking.eventId.endDate,
                                            location: booking.eventId.location,
                                            description: booking.eventId.description,
                                            image: booking.eventId.image,
                                            tags: booking.eventId.tags,
                                            organizer: booking.eventId.organizerId.username
                                        })
                                );
    return res.status(200).json(retV);
    
});

router.get('/events',async(req,res)=>{

    if(req.loggedUser.role !== 'organization' || req.loggedUser.id != req.params.id) return res.status(401).json({message: 'Utente non autenticato'});
    
    let dbVal = await eventModel.find({organizerId:req.params.id}).exec();
    if (!dbVal) return res.status(404).json({message: 'L\'organizzatore non ha ancora nessun evento creato'});
    else {
        let retV = [];
        dbVal.map((org)=>retV.push(org));
        return res.status(200).json(retV);
    }
    
});

module.exports = router;