const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Funzione per fare una prenotazione
const makeBooking = async (req, res) => {
  const { id } = req.params; // ID dell'evento
  const { seats } = req.body.howMany; // Numero di posti prenotati

  if (seats <= 0) {
    return res.status(400).json({ message: 'The number of seats cannot be zero.' });
  }

  try {
    // Trova l'evento
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Verifica che l'utente che richiede la prenotazione sia un cittadino
    if (req.user.role !== 'citizen') {
        return res.status(401).json({ message: 'Access denied: you are not allowed to book seats for this event.' });
    }

    // Verifica se ci sono posti disponibili
    const availableSeats = event.maxSeats - event.bookedSeats;
    if (seats > availableSeats) {
      return res.status(400).json({ message: `Insufficient seats available. Only ${availableSeats} seats available.` });
    }

    // Crea la prenotazione
    const booking = new Booking({
      eventId: event.id,
      citizenId: req.user.id, // L'utente autenticato è quello che prenota
      howMany: seats,
    });

    // Salva la prenotazione
    await booking.save();

    // Aggiorna l'evento con il nuovo numero di posti prenotati
    event.bookedSeats += seats;
    await event.save();

    res.status(201).json({
      message: 'Booking created successfully.',
      booking: booking,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server internal error.' });
  }
};

module.exports = { makeBooking };

//route da mettere in app.js
//app.post('/events/:id/booking', authenticate, authorize('citizen'), makeBooking);
