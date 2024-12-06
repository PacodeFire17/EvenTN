const Event = require('../../models/Event');
const Booking = require('../../models/bookings');

// Funzione per ottenere tutti gli ID delle prenotazioni per un evento
const bookingList = async (req, res) => {
  const id = req.params.id;

  try {
    // Trova l'evento con l'ID fornito
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).send('resource not found');
    }

    // Verifica che l'utente che richiede i dati sia l'organizzatore dell'evento
    if (event.organizerId.toString() !== req.loggedUser.id.toString()) {
      return res.status(401).send('user not authenticated');
    }

    // Trova tutte le prenotazioni associate a questo evento
    const reservations = await Booking.find({ eventId: id });

    // Restituisci gli ID delle prenotazioni
    const reservationsRet = []
    reservations.map(reservation => reservationsRet.push(reservation));
    
    return res.status(200).json({ reservationsRet });

  } catch (error) {
    console.error(error);
    return res.status(500).send('could not see the resource');
  }
};

module.exports = bookingList;