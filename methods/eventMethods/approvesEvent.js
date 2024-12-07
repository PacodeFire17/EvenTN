const Event = require('../../models/Event');

const approveEvent = async (req, res) => {
  const id = req.params.id;  // ID dell'evento passato come parametro

  try {
    // Trova l'evento in base all'ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({message: 'Non si può approvare un evento che non esiste'});
    }
    // Verifica che l'utente autenticato sia l'operatore comunale
    if (req.loggedUser.role !== 'townhall') {
        return res.status(401).json({message: 'L\'utente non dispone delle necessarie autorizzazioni'});
    }  

    // Verifica che l'evento non sia già stato approvato
    if (event.approved) {
      return res.status(400).json({message: 'L\'evento è già stato approvato'});
    }

    // Approva l'evento
    event.approved = true;
    await event.save();

    return res.status(200).json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Qalcosa è andato storto'});
  }
};

module.exports = approveEvent;