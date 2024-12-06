const Event = require('../../models/Event');

const infoEvent = async (req, res) => {
  const id = req.params.id;  // ID dell'evento passato come parametro

  try {
    // Trova l'evento in base all'ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).send('resource not found');
    }
    // Verifica che l'utente autenticato non sia un cittadino o un organizzatore esterno all'evento
    if (req.loggedUser.role === 'citizen' || (req.loggedUser.role === 'organization' && event.organizerId != req.loggedUser.id)) {
      return res.status(401).send('user not authenticated');
    }

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server internal error.');
  }
};

module.exports = infoEvent;