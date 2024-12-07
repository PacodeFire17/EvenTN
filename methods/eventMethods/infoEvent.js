const Event = require('../../models/Event');

const infoEvent = async (req, res) => {
  const id = req.params.id;  // ID dell'evento passato come parametro

  try {
    // Trova l'evento in base all'ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({message: 'L\'evento non esiste'});
    }
    // Verifica che l'utente autenticato non sia un cittadino o un organizzatore esterno all'evento
    if (req.loggedUser.role === 'citizen' || (req.loggedUser.role === 'organization' && event.organizerId != req.loggedUser.id)) {
      return res.status(401).json({message: 'L\'utente non possiede i privilegi adatti a eseguire questa azione'});
    }

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Qualcosa è andato storto'});
  }
};

module.exports = infoEvent;