const Event = require('../models/Event');
// Rotta per cercare eventi tramite tag
app.get('/events/search/tags', async (req, res) => {
  try {
    const tags = req.query.tags ? req.query.tags.split(',') : []; // Recupero i tag dalla query string e li divide in un array

    // Controllo se sono stati forniti tag
    if (!Array.isArray(tags) || tags.length === 0) {
      return res.status(400).send({ message: 'A list of tags is required.' });
    }

    // Determino il filtro in base al ruolo dell'utente
    let filter = { tags: { $in: tags } }; // Base filter per i tag
    const user = req.user; // Supponendo che req.user contenga i dettagli dell'utente autenticato

    if (!user || user.role === 'citizen') {
      // Se l'utente non è autenticato o è un "citizen"
      filter.approved = true;
    }

    // Cerco eventi che corrispondono al filtro
    const events = await Event.find(filter);

    // Se non sono stati trovati eventi, restituisco 404
    if (events.length === 0) {
      return res.status(404).send({ message: 'There is no event with these tags.' });
    }

    // Rispondo con gli eventi trovati
    res.status(200).json(events);
  } catch (err) {
    console.error('Error while searching the event:', err.message);
    res.status(500).send({ message: 'Server error' });
  }
});