const Event = require('../../models/Event');
const Booking = require('../../models/bookings');

const deleteEvent = async (req, res) => {
  const id = req.params.id;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({message: 'Non si può eliminare qualcosa che non esiste'});
    }

    // Verifica se l'utente è l'organizzatore dell'evento o un operatore comunale
    if (event.organizerId.toString() !== req.loggedUser.id.toString() && req.loggedUser.role != 'townhall') {
      return res.status(401).json({message: 'L\'utente non dispone delle necessarie autorizzazioni'});
    }

    // Cancella tutte le prenotazioni dell'evvento
    await Booking.deleteMany({eventId: event._id});

    // Elimina l'evento
    const deletedEvent = await Event.findByIdAndDelete(id);
    res.status(200).json(deletedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Qualcosa è andato storto'});
  }
};

module.exports = deleteEvent;