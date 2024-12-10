const express = require('express');
const tokenChecker = require('../tokenChecker');
const auth = require('./authentication');
const idMethods = require ('./idUri');
const getO = require('./getOrgs');
const userModel = require('../../models/user');
const router = express.Router({mergeParams: true});

//tutti i metodi riguardanti /users

router.use('/authenticate',auth);
router.use('/organizations',getO);

router.get('/salt',async (req,res)=>{

    if (!req.query.username) return res.status(400).json({message: 'Uno username deve essere inserito'});

    const wannaLogin = await userModel.find({username: req.query.username}).exec();
    
    if (wannaLogin) return res.status(200).json({salt: wannaLogin.salt});
    else return res.status(404).json({message: 'L\'utente non esiste'});
});

router.use(tokenChecker);

router.use('/:id',idMethods);
router.get('', async (req,res) => {

    if(!req.query.id) return res.status(404).json({message: 'Si deve inserire un id'});

    if(req.query.id === req.loggedUser.id){
        return res.status(200).json({id: req.loggedUser.id, username: req.loggedUser.username, role: req.loggedUser.role});
    } else return res.status(404).json({message: 'L\'utente non esiste'});
});

module.exports = router;