const eventModel = require('../../models/Event');
const tokenCheker = require('../tokenChecker');
const express = require('express');
const jwt = require('jsonwebtoken');
const singleEvent  = require('./singleEventMethods');
const search = require('./searchMethods');
const router = express.Router();

//metodi di /events

router.use('/search',search);

// Rotta per ottenere tutti gli eventi
router.get('', async (req, res) => {
  try {
    // Trova tutti gli eventi
    let events;

    if(req.query.approved !== undefined && !req.query.approved){ //solo operatori comunali dovrebbero vedere questo risultato

      if(!req.query.AuthNToken) return res.status(401).json({message: 'Un token deve essere previsto'});

      jwt.verify(req.query.AuthNToken,process.env.SUPER_SECRET_KEY,function (err,decoded){
        if (err) return res.status(401).json({message: 'The token is not valid. Authenticate again'});
        else if (decoded.role!=='townHall') return res.status(401).json({message: 'L\'utente non dispone dei privilegi per svolgere questa azione'});
      });

      events = await eventModel.find({ approved: false }).populate('organizerId').exec();
    } else {
      events = await eventModel.find({ approved: true }).populate('organizerId').exec();
    }

    if (!events.length) {
      return res.status(404).json({message: 'Non ci sono eventi'});
    } else {
      // Modifico in un formato leggibile per la risposta
      const eventList = events.map(event => ({
        id: event._id,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        description: event.description,
        image: event.image,
        needBooking: event.needBooking,
        tags: event.tags,
        organizer: event.organizerId.username
      }));
    
      // Risposta con gli eventi trovati
      return res.status(200).json(eventList);
    }
  } catch (err) {
    //catcho gli errori
    res.status(500).json({message: 'Qualcosa è andato storto'});
  }
});

// Abilito l'obbligo di autenticazione
router.use(tokenCheker);

router.use('/:id',singleEvent);

// Rotta per aggiungere un nuovo evento
router.post('', async (req, res) => {
  try {

    // Controllo che l'utente sia un organizzatore
    if (req.loggedUser.role !== 'organization') {
      return res.status(403).json({ message: 'Only organizers can create events.' });
    }

      const event = req.body.Event;

      //controllo duplicati
      const duplicate = await eventModel.find({
        name: event.name,
        organizerId: event.organizerId,
        'startDate.day': event.startDate.day,
        'startDate.month': event.startDate.month,
        'startDate.year': event.startDate.year,
        'startDate.hour': event.startDate.hour,
        'startDate.minutes': event.startDate.minutes
      }).exec();

      if(duplicate.length <= 0){
        // Creazione del nuovo evento
        const newEvent = new eventModel({
          name: event.name,
          startDate: event.startDate,
          endDate: event.endDate,
          location: event.location,
          description: event.description,
          image: event.image,
          needBooking: event.needBooking,
          tags: event.tags,
          maxSeats: event.maxSeats || 0,
          bookedSeats: 0,
          organizerId: req.loggedUser.id,
          approved: false, // Default: da approvare
          bookings: [],
          resources: event.resources,
        });

        // Salvataggio nel database
        const savedEvent = await newEvent.save();

        eventModel.findOneAndUpdate({_id: event._id},{$set: {self: 'events/'+event._id}});

        // Risposta con l'evento creato
        return res.status(201).json(savedEvent);
      } else return res.status(400).json({message: 'L\'evento che si vuole creare esiste già' })
  } catch (err) {
    console.error('Error during event creation', err.message);
    return res.status(500).json({message: 'Qualcosa è andato storto'});
  }
});

module.exports = router;