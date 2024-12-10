const jwt = require('jsonwebtoken');

// middelware per verificare se il token fornito è valido
const tokenChecker = function(req, res, next) {
    var token = req.query.token || req.body.AuthNToken;

    if (!token) return res.status(401).json({message: 'A token must be provided'});
    else{
        jwt.verify(token, process.env.SUPER_SECRET_KEY, function(err, decoded) {
            if (err) return res.status(401).json({message: 'The token is not valid. Authenticate again'});
            else {
                req.loggedUser = decoded;
                next();
            }
        });
    }
};

module.exports = tokenChecker;