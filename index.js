const mongoose = require('mongoose');
const express = require('express');
const uMethods = require('./methods/userMethods/userMethods');
const eMethods = require('./methods/eventMethods/eventMethods');
const app = express();

const PORT = process.env.PORT || 10000;
const DB_URL = process.env.DB_URL;

app.use(express.json());
app.use((req,res,next)=>{console.log(req.method+' '+req.url);next();});

// the list of methods goes here

app.use('/users',uMethods);
app.use('/events',eMethods);

mongoose.connect(DB_URL).then(()=>{

    app.listen(PORT,()=>{console.log('listening on port: %d', PORT)});
    
}).catch((err)=>console.log('Failed to connect to database: ' + DB_URL));