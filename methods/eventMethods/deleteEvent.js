const Event = require('../../models/Event');

const deleteEvent = async (req, res) => {
  const id = req.params.id;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).send('resource not found');
    }

    // Verifica se l'utente è l'organizzatore dell'evento o un operatore comunale
    if (event.organizerId.toString() !== req.loggedUser.id.toString() && req.loggedUser.role != 'townhall') {
      return res.status(402).send('user not authenticated');
    }

    // Elimina l'evento
    const deletedEvent = await Event.findByIdAndDelete(id);
    res.status(200).json(deletedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server internal error.');
  }
};

module.exports = deleteEvent;