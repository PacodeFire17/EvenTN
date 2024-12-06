const Event = require('../../models/Event');

const approveEvent = async (req, res) => {
  const id = req.params.id;  // ID dell'evento passato come parametro

  try {
    // Trova l'evento in base all'ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).send('resource not found');
    }
    // Verifica che l'utente autenticato sia l'operatore comunale
    if (req.loggedUser.role !== 'townhall') {
        return res.status(401).send('user not authenticated');
    }  

    // Verifica che l'evento non sia già stato approvato
    if (event.approved) {
      return res.status(400).send('bad request');
    }

    // Approva l'evento
    event.approved = true;
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server internal error.');
  }
};

module.exports = approveEvent;