const Event = require('../models/Event');

const deleteEvent = async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Evento non trovato.' });
    }

    // Verifica se l'utente è l'organizzatore dell'evento o un operatore comunale
    if (event.organizerId.toString() !== req.user.id.toString() && (req.user.role !== 'townhall' || req.user.role !== 'organization')) {
      return res.status(401).json({ message: 'Access denied: you are not allowed to delete this event.' });
    }

    // Elimina l'evento
    await Event.findByIdAndDelete(id);
    res.status(200).json({ message: 'Event deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server internal error.' });
  }
};

module.exports = { deleteEvent };

//da mettere come route in app.js --> // Route per eliminare un evento
//app.delete('/events/:id', authenticate, authorize(['townhall', 'organization']), deleteEvent);
