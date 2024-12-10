const express = require('express');
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user');
const crypto = require('crypto');
const router = express.Router();

// metodo per autenticare un utente
router.post('',async (req,res)=>{

    if(!req.body.username || !req.body.password) return res.status(400).json({message: 'Un nome utente e una password devono essere inseriti'});

    let sameName = await userModel.findOne({username: req.body.username}).exec();

    if (sameName){
        req.body.password=req.body.password;
        if (req.body.password === sameName.password){
            let token = jwt.sign({username: sameName.username, role: sameName.role, id:sameName._id, self: sameName.self},process.env.SUPER_SECRET_KEY,{expiresIn: 86400});
            return res.status(200).json({message: 'L\'autenticazione è andata a buon fine. Il token dura un giorno',AuthNToken: token,role: sameName.role});
        } else {
            return res.status(401).json({message: 'Username o password errati. Riprovare'});
        }
    }
    
    return res.status(401).json({message: 'Username o password errati. Riprovare'});
});

module.exports = router;