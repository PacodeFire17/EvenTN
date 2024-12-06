const eventModel = require('../../models/Event');
const tokenCheker = require('../tokenChecker');
const express = require('express');
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

    if(req.query.approved !== undefined && !req.query.approved){
      events = await eventModel.find({ approved: false }).exec();
    } else events = await eventModel.find({ approved: true }).exec();

    if (!events.length) {
      return res.status(404).send('resource not found1');
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
        organizerId: event.organizerId
      }));
    
      // Risposta con gli eventi trovati
      return res.status(200).json(eventList);
    }
  } catch (err) {
    //catcho gli errori
    res.status(404).send('resource not found2');
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
      return res.status(403).send({ message: 'Only organizers can create events.' });
    } else {

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
      } else return res.status(500).send('resource not created');
    }
  } catch (err) {
    console.error('Error during event creation', err.message);
    return res.status(501).send('resource not created');
  }
});

module.exports = router;