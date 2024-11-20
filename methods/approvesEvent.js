const Event = require('../models/Event');

const approveEvent = async (req, res) => {
  const { id } = req.params;  // ID dell'evento passato come parametro

  try {
    // Trova l'evento in base all'ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    // Verifica che l'utente autenticato sia l'operatore comunale
    if (req.user.role !== 'townhall') {
        return res.status(401).json({ message: 'Access denied: you are not allowed to approve or reject an event.' });
    }  

    // Verifica che l'evento non sia già stato approvato
    if (event.approved) {
      return res.status(400).json({ message: 'This event has already been approved.' });
    }

    // Approva l'evento
    event.approved = true;
    await event.save();

    res.status(200).json({ message: 'Event approved successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server internal error.' });
  }
};

const rejectEvent = async (req, res) => {
  const { id } = req.params;  // ID dell'evento passato come parametro

  try {
    // Trova l'evento in base all'ID
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    // Verifica che l'utente autenticato sia l'operatore comunale
    if (req.user.role !== 'townhall') {
        return res.status(401).json({ message: 'Access denied: you are not allowed to approve or reject an event.' });
    }  

    // Verifica che l'evento non sia già stato rifiutato
    if (event.approved === false) {
      return res.status(400).json({ message: 'This event has already been rejected.' });
    }

    // Rifiuta l'evento
    event.approved = false;
    await event.save();

    res.status(200).json({ message: 'Event rejected successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server internal error.' });
  }
};

module.exports = { approveEvent, rejectEvent };

//route da mettere in app.js 
//per approvare un evento
//router.put('/events/:id', authenticate, authorize('townhall'), approveEvent);

//per rifiutare un evento
//router.put('/events/:id', authenticate, authorize('townhall'), rejectEvent);

