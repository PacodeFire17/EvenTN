const jwt = require('jsonwebtoken');

// middelware per verificare se il token fornito è valido
const tokenChecker = function(req, res, next) {
    var token = req.query.token || req.body.AuthNToken;

    if (!token) res.status(401).send('token not provided');
    else{
        jwt.verify(token, process.env.SUPER_SECRET_KEY, function(err, decoded) {
            if (err) res.status(401).send('user not authenticated');
            else {
                req.loggedUser = decoded;
                next();
            }
        });
    }
};

module.exports = tokenChecker;