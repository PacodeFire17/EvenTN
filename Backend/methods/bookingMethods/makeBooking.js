const Event = require('../../models/Event');
const Booking = require('../../models/bookings');

// Funzione per fare una prenotazione
const makeBooking = async (req, res) => {
  const id = req.params.id; // ID dell'evento
  const seats = req.body.howMany; // Numero di posti prenotati

  if (seats <= 0) {
    return res.status(400).json({message: 'Almeno un posto deve essere selezionato'});
  }

  try {
    // Trova l'evento
    const event = await Event.findById(id);

    // Verifica che l'evento esista e che sia approvato
    if (!event || !event.approved) {
      return res.status(404).json({message: 'Non è possibile prenotarsi a questo evento'});
    }

    // Verifica che l'utente che richiede la prenotazione sia un cittadino
    if (req.loggedUser.role !== 'citizen') {
      return res.status(401).json({message: 'L\'utente non possiede i privilegi adatti a eseguire questa azione'});
    }

    // Verifica se ci sono posti disponibili
    const availableSeats = event.maxSeats - event.bookedSeats;
    if (seats > availableSeats) {
      return res.status(400).json({message: 'I posti richiesti eccedono i posti disponibili'});
    }

    // Verifica se il cittadino ha già prenotato
    const check = await Booking.find({citizenId: req.loggedUser.id, eventId: event._id}).exec(); 
    if (check.length!=0){
      return res.status(400).json({message: 'Esiste già una prenotazione per questo evento a nome '+req.loggedUser.username});
    }

    // Crea la prenotazione
    const booking = new Booking({
      eventId: event.id,
      citizenId: req.loggedUser.id, // L'utente autenticato è quello che prenota
      howMany: seats,
    });

    // Salva la prenotazione
    await booking.save();

    Booking.findOneAndUpdate({_id:booking._id},{$set:{self:'/bookings/'+booking._id}});

    // Aggiorna l'evento con il nuovo numero di posti prenotati
    event.bookedSeats += seats;
    event.bookings.push(booking._id);
    await event.save();

    return res.status(201).json(booking);
  
  } catch (error) {
    console.error(error);
    return res.status(500).json({message: 'Qualcosa è andato storto'});
  }
};

module.exports = makeBooking;