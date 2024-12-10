const mongoose = require('mongoose');
const userModel = require('../models/user');
const bookModel = require('../models/bookings');
const eventModel = require('../models/Event');
const bookings = require('../models/bookings');

// scommenta i modelli da aggiungere

async function init(){
    // const user = new userModel({username:'',
    //                             password:'',
    //                             role:'',
    //                             salt:'abcdefg'});
    // await user.save();
    // await bookModel.updateOne({_id:user._id},{$set:{self: '/users/'+user._id}});

    // const event = new eventModel({name:'',
    //                             startDate:{day:,
    //                                         month:,
    //                                         year:,
    //                                         hour:,
    //                                         minutes:},
    //                             endDate:{day:,
    //                                     month:,
    //                                     year:,
    //                                     hour:,
    //                                     minutes:},
    //                             location:{via:'',
    //                                         number:,
    //                                         city:'',
    //                                         CAP:,
    //                                         region:'',
    //                                         country:''},
    //                             maxSeats:,
    //                             bookedSeats:,
    //                             description:'',
    //                             needBooking:,
    //                             tags:[],
    //                             organizerId:'',
    //                             approved:,
    //                             bookings:[],
    //                             resources:''});
    // await event.save();
    // await eventModel.updateOne({_id:event._id},{$set:{self: '/events/'+event._id}});

    // const booking = new bookModel({citizenId:'',
    //                                 howMany:,
    //                                 eventId:''});

    // await booking.save();
    // await bookModel.updateOne({_id:booking._id},{$set:{self: '/bookings/'+booking._id}});
    // await eventModel.updateOne({_id:'674d7fc8e6b085b85ac6ed3a'},{$push:{bookings: booking._id}});
}

mongoose.connect(process.env.DB_URL).then(()=>{
    init().catch((err)=>(console.log('Couldnt create the resource(s)'))).finally(console.log('Resource(s) created'));
}).catch((err)=>console.log('Failed to connect to database: ' + process.env.DB_URL));