const express = require('express');
const jwt = require('jsonwebtoken');
const userModel = require('../../models/user');
const crypto = require('crypto');
const router = express.Router();

// metodo per autenticare un utente
router.post('',async (req,res)=>{
    let sameName = await userModel.findOne({username: req.body.username}).exec();
    if (sameName){
        const hash = crypto.createHash('sha256'); // questa parte dovrebbe essere fatta nel frontend
        hash.update(req.password+sameName.salt);
        let hashedPw = hash.digest('hex');
        if (hashedPw === sameName.password){
            let token = jwt.sign({username: sameName.username, role: sameName.role, id:sameName._id, self: sameName.self},process.env.SUPER_SECRET_KEY,{expiresIn: 86400});
            res.status(200).json({success: true,AuthNToken: token});
        } else {
            res.status(401).json({success: false});
        }
    } else res.status(400).send('The user does not exist');
});

module.exports = router;