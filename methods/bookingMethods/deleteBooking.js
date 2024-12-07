const Event = require('../../models/Event');
const Booking = require('../../models/bookings');

const cancelBooking = async (req, res) => {
  const eventId = req.params.id;  // Ottieni l'ID dell'evento dalla query string
  const userId = req.loggedUser.id;  // ID dell'utente loggato
  const bookingId = req.query.id; // ID della prenotazione

  if (!eventId) {
    res.status(400).json({message: 'Un evento deve essere specificato'});
  }

  try {
    // Verifica se l'evento esiste
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({message: 'L\'evento '+eventId+ ' non esiste'});
    }
    // Verifica che l'utente che richiede l'azione sia un cittadino
    if (req.loggedUser.role !== 'citizen') {
      return res.status(401).json({message: 'L\'utente non possiede i privilegi adatti a eseguire questa azione'});
    }

    // Trova la prenotazione dell'utente per l'evento
    const booking = await Booking.findOne({ eventId:eventId, citizenId:userId });
    if (!booking) {
      return res.status(404).json({message: 'Non esiste una prenotazione per questo evento'});
    }

    // Elimina la prenotazione
    if(bookingId == booking._id){
      //mi salvo la prenotazione da eliminare
      const retV = booking;

      await booking.deleteOne({_id:booking._id});

      // Rimuovi la prenotazione anche dalla lista delle prenotazioni dell'evento
      event.bookedSeats -= retV.howMany;
      event.bookings.pull(booking.id);
      await event.save();

      return res.status(200).json(retV);

    } else return res.status(401).json({message: 'La prenotazione non può essere cancellata da '+req.loggedUser.username});

  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Qualcosa è andato storto'});
  }
};

module.exports = cancelBooking;