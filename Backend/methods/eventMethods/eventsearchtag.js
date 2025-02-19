const Event = require('../../models/Event');
const img = require('./placeholderImg');
const express = require('express');
const router = express.Router({mergeParams: true});

// Rotta per cercare eventi tramite tag /events/search/tags
router.post('', async (req, res) => {
  try {
    const tags = req.body ? req.body : []; // Recupero i tag dalla query string e li divide in un array

    // Controllo se sono stati forniti tag
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).json({message: 'Si deve inserire almeno un tag'});
    }

    // Determino il filtro in base al ruolo dell'utente
    let filter = { tags: { $in: tags } }; // Base filter per i tag

    filter.approved = true;

    // Cerco eventi che corrispondono al filtro
    const events = await Event.find(filter).populate('organizerId').exec();

    // Se non sono stati trovati eventi, restituisco 404
    if (events.length === 0) {
      return res.status(404).json({message: 'Nessun evento corrisponde ai cirteri di ricerca'});
    }

    let ret = [];
    events.map((e)=>ret.push({
      id: e._id,
      name: e.name,
      startDate:e.startDate,
      endDate:e.endDate,
      location: e.location,
      maxSeats: e.maxSeats,
      bookedSeats: e.bookedSeats,
      description: e.description,
      image: img,
      needBooking: e.needBooking,
      tags: e.tags,
      organizer: e.organizerId.username,
      organizerId: e.organizerId._id,
      self: e.self
    }));

    // Rispondo con gli eventi trovati
    return res.status(200).json(ret);
  } catch (err) {
    console.error('Error while searching the event:', err.message);
    return res.status(500).json({message: 'Qualcosa è andato storto'});
  }
});

module.exports = router;
