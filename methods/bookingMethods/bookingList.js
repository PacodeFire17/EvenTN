const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Funzione per ottenere tutti gli ID delle prenotazioni per un evento
const bookingList = async (req, res) => {
  const { id } = req.params;

  try {
    // Trova l'evento con l'ID fornito
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Verifica che l'utente che richiede i dati sia l'organizzatore dell'evento
    if (event.organizerId.toString() !== req.user.id.toString() && req.user.role !== 'organization') {
      return res.status(401).json({ message: 'Access denied: you are not allowed to see the booking list of this event.' });
    }

    // Trova tutte le prenotazioni associate a questo evento
    const reservations = await Booking.find({ event: id }).select('id');

    // Restituisci gli ID delle prenotazioni
    const reservationIds = reservations.map(reservation => reservation._id);
    
    res.status(200).json({ reservationIds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server internal error.' });
  }
};

module.exports = { bookingList };

//route da mettere in app.js per richiamare bookingList
//app.get('/events/:id/bookings', authenticate, authorize(['organization']), bookingList);


