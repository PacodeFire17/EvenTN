const Event = require('../models/Event');
const Booking = require('../models/Booking');

const cancelBooking = async (req, res) => {
  const eventId = req.query.id;  // Ottieni l'ID dell'evento dalla query string
  const userId = req.user.id;  // ID dell'utente loggato

  if (!eventId) {
    return res.status(400).json({ message: 'ID not provided.' });
  }

  try {
    // Verifica se l'evento esiste
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    // Verifica che l'utente che richiede l'azione sia un cittadino
    if (event.organizerId.toString() !== req.user.id.toString() && req.user.role !== 'citizen') {
        return res.status(401).json({ message: 'Access denied: you are not allowed to delete a booking for this event.' });
    }

    // Trova la prenotazione dell'utente per l'evento
    const booking = await Booking.findOne({ citizenId: userId, eventId: eventId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Elimina la prenotazione
    await booking.remove();

    // Rimuovi la prenotazione anche dalla lista delle prenotazioni dell'evento
    event.bookings.pull(booking.id);
    await event.save();

    res.status(200).json({ message: 'Booking deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server internal error.' });
  }
};

module.exports = { cancelBooking };

//route da mettere in app.js
//router.delete('/events/:id/booking', authenticate, authorize('citizen'), cancelBooking);
