const jwt = require('jsonwebtoken');

// middelware per verificare se il token fornito è valido
const tokenChecker = function(req, res, next) {
    var token = req.query.token || req.body.AuthNToken;

    if (!token) res.status(401).json({message:'No token provided.'});
    else{
        jwt.verify(token, process.env.SUPER_SECRET_KEY, function(err, decoded) {
            if (err) res.status(401).json({message:'User not authenticated'});
            else {
                req.loggedUser = decoded;
                next();
            }
        });
    }
};

module.exports = tokenChecker;