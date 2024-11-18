
const jwt = require('jsonwebtoken');

// Rotta per aggiungere un nuovo evento
app.post('/events', async (req, res) => {
  try {
    const { AuthNToken, Event } = req.body;

    // Verifico se il token e i dati dell'evento sono forniti
    if (!AuthNToken || !Event) {
      return res.status(400).send({ message: 'Authentication token and event data are required.' });
    }

    // Decodifico il token per verificare se l'utente è un organizzatore
    let user;
    try {
      user = jwt.verify(AuthNToken, process.env.JWT_SECRET); // Controllare che sia configurato
    } catch (err) {
      return res.status(401).send({ message: 'Invalid authentication token.' });
    }

    // Controllo che l'utente sia un organizzatore
    if (user.role !== 'organization') {
      return res.status(403).send({ message: 'Only organizers can create events.' });
    }

    // Validazione dei dati dell'evento
    const { name, startDate, endDate, location, description, needBooking, tags, maxSeats } = Event;
    if (!name || !startDate || !location) {
      return res.status(400).send({ message: 'Name, start date, and location are required.' });
    }

    // Creazione del nuovo evento
    const newEvent = new EventModel({
      name,
      startDate,
      endDate,
      location,
      description,
      needBooking,
      tags,
      maxSeats: maxSeats || null,
      bookedSeats: 0,
      organizerId: user.id,
      approved: false, // Default: da approvare
      bookings: [],
      resources: '',
      self: `/events/${name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}` // Evita duplicati
    });

    // Salvataggio nel database
    const savedEvent = await newEvent.save();

    // Risposta con l'evento creato
    res.status(201).json(savedEvent);
  } catch (err) {
    console.error('Error during event creation', err.message);
    res.status(500).send({ message: 'Internal server error.' });
  }
});
