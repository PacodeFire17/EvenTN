const Event = require('models/event');
// Rotta per ottenere tutti gli eventi approvati
app.get('/events', async (req, res) => {
    try {
      // Estraggo il parametro di query "approved" (di default true se non specificato)
      const { approved = true } = req.query;
  
      // Trova tutti gli eventi approvati
      const events = await Event.find({ approved: approved === 'true' });
  
      if (!events.length) {
        return res.status(404).send({ message: 'Events not found' });
      }
  
      // Modifico in un formato leggibile per la risposta
      const eventList = events.map(event => ({
        id: event._id,
        name: event.name,
        startDate: event.startDate,
        endDate: event.endDate,
        location: event.location,
        description: event.description,
        needBooking: event.needBooking,
        tags: event.tags,
        organizerId: event.organizerId
      }));
  
 // Risposta con gli eventi trovati
 res.status(200).json(eventList);
} catch (err) {
    //catcho gli errori
  res.status(404).send({ error: err.message });
}
});  

//route da mettere in app.js
//app.get()