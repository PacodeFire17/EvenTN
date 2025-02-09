function setCors(req, res, next) { // Add headers before the routes are defined
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'https://eventn-1.onrender.com');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
}

module.exports = setCors;