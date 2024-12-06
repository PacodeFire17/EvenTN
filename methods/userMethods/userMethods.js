const express = require('express');
const cors = require('cors');
const tokenChecker = require('../tokenChecker');
const auth = require('./authentication');
const idMethods = require ('./idUri');
const getO = require('./getOrgs');
const userModel = require('../../models/user');
const router = express.Router({mergeParams: true});

app.use(cors());

//tutti i metodi riguardanti /users

router.use('/authenticate',auth);
router.use('/organizations',getO);

router.get('salt',async (req,res)=>{
    const wannaLogin = await userModel.find({username: req.query.username}).exec();
    if (wannaLogin) return res.status(200).json({salt: wannaLogin.salt});
    else return res.status(404).json({message: 'L\'utente non esiste'});
});

router.use(tokenChecker);

router.use('/:id',idMethods);
router.get('', async (req,res) => {
    if(req.query.id === req.loggedUser.id){
        res.status(200).json({id: req.loggedUser.id, username: req.loggedUser.username, role: req.loggedUser.role});
    } else res.status(404).json({message: 'L\'utente non esiste'});
});

module.exports = router;