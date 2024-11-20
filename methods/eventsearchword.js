const Event = require('../models/Event');
// Metodo per la ricerca dell'evento con le parole
app.get('/event/search/type', async (req, res) => {
    try {
      const { name } = req.query;
  
      // Controllo se il parametro "name" è fornito
      if (!name) {
        return res.status(400).send({ message: 'The parameter "name" is required' });
      }
  
      // Determino il filtro in base al ruolo dell'utente
      let filter = {
        name: { $regex: name, $options: 'i' } // 'i' per rendere la ricerca case-insensitive
      };
      
      const user = req.user; // Supponendo che req.user contenga i dettagli dell'utente autenticato
      
      if (!user || user.role === 'citizen') {
        // Se l'utente non è autenticato o è un "citizen"
        filter.approved = true;
      }
  
      // Cerco eventi che corrispondono al filtro
      const events = await Event.find(filter);
  
      // Se non sono stati trovati eventi, restituisco 404
      if (events.length === 0) {
        return res.status(404).send({ message: 'There is no event with this name' });
      }
  
      // Rispondo con gli eventi trovati
      res.status(200).json(events);
    } catch (err) {
      console.error('Error while searching the event:', err.message);
      res.status(500).send({ message: 'Server error' });
    }
  });