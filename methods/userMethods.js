const express = require('express');
const tokenChecker = require('./tokenChecker');
const auth = require('./userMethods/authentication');
const idMethods = require ('./userMethods/idUri');
const getO = require('./userMethods/getOrgs');
const router = express.Router();

//tutti i metodi riguardanti /users

router.get('',tokenChecker, async (req,res) => {
    if(req.query.id === req.loggedUser.id){
        res.status(200).json({id: req.loggedUser.id, username: req.loggedUser.username, role: req.loggedUser.role});
    } else res.status(404).send('Resource not found');
});

router.use('/authenticate',auth);

router.use('/:id',idMethods);

router.use('/organizations',getO);

module.exports = router;