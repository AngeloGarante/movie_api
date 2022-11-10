const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require("express");
const morgan = require("morgan");
const Movies = Models.Movie;
const Users = Models.User;
//mongoose.connect('mongodb://localhost:27017/myFLixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const bodyParser = require('body-parser'),
    uuid = require("uuid");
const { toString } = require("lodash");
const { json } = require("body-parser");
methodOverride = require('method-override');
app.use(bodyParser.json());
app.use(morgan("common"));
const cors = require("cors");
let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
let transAuth = passport.authenticate('jwt', { session: false });
const bcrypt = require("bcrypt");
const { check, validationResult } = require('express-validator');
//allowed Origins
let allowedOrigins = ['http://localhost:1234', 'https://myflix-angelo.herokuapp.com/',];
const port = process.env.PORT || 8081;

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = "The CORS policy for this application doesn't allow access from the origin " + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));
//Home page
app.get("/", (req, res) => {
    res.send("Please visit URL//public/documentation.html");
});
// return list of movies
app.get("/movies", transAuth, (req, res) => {
    Movies.find().then((movies) => res.status(201).json(movies)).catch((err) => { console.error(err); res.status(500).send("Error " + err) })
});
// return data by title
app.get('/movies/:title', transAuth, (req, res) => {
    Movies.findOne({ Title: req.params.title }).then((movie) => res.status(200).json(movie)).catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err)
    })
});
// return data by genre
app.get("/movies/genre/:genre", transAuth, (req, res) => {
    Movies.find({ "Genre.Name": req.params.genre }).then((movie) => res.status(200).json(movie)).catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err)
    })
})
//return data by director
app.get("/movies/directed/:directed", transAuth, (req, res) => {
    Movies.find({ "Director.Name": req.params.directed }).then((movie) => res.status(200).json(movie)).catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err)
    })
}
)
// create new user
app.post('/users', [
    check("Username", "Username is required").isLength({ min: 5 }),
    check("Username", "Username contains non alphanumeric characters - is not allowed").isAlphanumeric(),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Email is not valid").isEmail()
], (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => { res.status(201).json(user) })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: ' + error);
                    });
            }
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
        });
});
//update user
app.put("/users/:Username", transAuth, (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true },
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});

//add favorite
app.put('/users/:Username/favorite/:MovieID', transAuth, (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});
//remove favorite
app.delete('/users/:Username/favorite/:MovieID', transAuth, (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }, // This line makes sure that the updated document is returned
        (err, updatedUser) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error: ' + err);
            } else {
                res.json(updatedUser);
            }
        });
});
// delete account
app.delete("/users/:Username/deregister", transAuth, (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});