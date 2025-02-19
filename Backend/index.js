const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const corsSetter = require('./methods/corsSetter');
const uMethods = require('./methods/userMethods/userMethods');
const eMethods = require('./methods/eventMethods/eventMethods');

const app = express();

const PORT = process.env.PORT || 10000;
const DB_URL = process.env.DB_URL;

app.use(cors());
app.use(corsSetter);
app.use(express.json());
app.use((req,res,next)=>{console.log(req.method+' '+req.url);next();});

// the list of methods goes here

app.use('/api/v1/users',uMethods);
app.use('/api/v1/events',eMethods);

mongoose.connect(DB_URL).then(()=>{

    app.listen(PORT,()=>{console.log('listening on port: %d', PORT)});
    
}).catch((err)=>console.log('Failed to connect to database: ' + DB_URL));

module.exports = { app, connectToDatabase: async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to database:', DB_URL);
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
} };