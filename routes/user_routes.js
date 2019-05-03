const isAuthenticated = require('../config/isAuthenticated');
const auth = require('../config/auth');
const db = require('../models');

const setupUserRoutes = (app) => {
    // LOGIN ROUTE
    app.post('/api/login', (req, res) => {
        auth
            .logUserIn(req.body.email, req.body.password)
            .then(dbUser => res.json(dbUser))
            .catch(err => res.status(400).json(err));
    });

    // SIGNUP ROUTE
    app.post('/api/signup', (req, res) => {
        db.User.create(req.body)
            .then(data => res.json(data))
            .catch(err => res.status(400).json(err));
    });

    // Any route with isAuthenticated is protected and you need a valid token
    // to access
    app.get('/api/user/:id', isAuthenticated, (req, res) => {
        db.User.findById(req.params.id).then(data => {
            if (data) {
                res.json(data);
            } else {
                res.status(404).send({ success: false, message: 'No user found' });
            }
        }).catch(err => res.status(400).send(err));
    });

    // Serve up static assets (usually on heroku)
    if (process.env.NODE_ENV === "production") {
        app.use(express.static("client/build"));
    }

    app.get('/', isAuthenticated /* Using the express jwt MW here */, (req, res) => {
        res.send('You are authenticated'); //Sending some response when authenticated
    });
}

module.exports = setupUserRoutes;