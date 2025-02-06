const Event = require('../../models/Event');
const img = require('./placeholderImg');
const express = require('express');
const router = express.Router({mergeParams: true});
// Metodo per la ricerca dell'evento con le parole
router.get('', async (req, res) => {
    try {
      const name = req.query.name;
  
      // Controllo se il parametro "name" è fornito
      if (!name) {
        return res.status(400).json({message: 'The parameter "name" is required'});
      }
  
      // Determino il filtro in base al ruolo dell'utente
      let filter = {
        name: { $regex: name, $options: 'i' } // 'i' per rendere la ricerca case-insensitive
      };
      
      const user = req.user; // Supponendo che req.user contenga i dettagli dell'utente autenticato
      
      if (!user || user.role === 'citizen') {
        // Se l'utente non è autenticato o è un "citizen"
        filter.approved = true;
      }
  
      // Cerco eventi che corrispondono al filtro
      const events = await Event.find(filter).populate('organizerId').exec();
  
      // Se non sono stati trovati eventi, restituisco 404
      if (events.length === 0) {
        return res.status(404).json({message: 'Nessun evento corrisponde ai criteri di ricerca'});
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
      res.status(200).json(ret);
    } catch (err) {
      console.error('Error while searching the event:', err.message);
      res.status(500).json('Qualcosa è andato storto');
    }
  });

module.exports = router;