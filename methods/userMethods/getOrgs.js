const express = require('express');
const userModel = require('../../models/user');
const router = express.Router();

//metodo per /users/organizations

router.get('',async (req,res)=>{
    let dbVal = await userModel.find({role:'organization'}).exec();
    if (!dbVal) return res.status(404).json({message: 'Non ci sono organizzazioni'});
    let retV = [];
    dbVal.map((org)=>retV.push({id:org._id,username:org.username,role:org.role}));
    res.status(200).json(retV);
});

module.exports = router;