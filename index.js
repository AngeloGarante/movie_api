const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require("express");
const morgan = require("morgan");
const Movies = Models.Movie;
const Users = Models.User;
const cors = require("cors");
//mongoose.connect('mongodb://localhost:27017/myFLixDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI.toString(), { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
const bodyParser = require('body-parser'),
    uuid = require("uuid");
const { toString } = require("lodash");
const { json } = require("body-parser");
methodOverride = require('method-override');
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("common"));


let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');
let transAuth = passport.authenticate('jwt', { session: false });
const bcrypt = require("bcrypt");
const { check, validationResult } = require('express-validator');
//allowed Origins
let allowedOrigins = ['http://localhost:1234/', 'https://myflix-angelo.herokuapp.com/', '*'];
const PORT = process.env.PORT || 8081;
/**
 * Home page
 * @name Home Page
 * @kind function
 * @return Home Page
 */
//Home page
app.get("/", (req, res) => {
    res.send("Please visit, URL//public/documentation.html");
});
/**
 * Movies list
 * @name Get All movies
 * @kind function
 * @return arrays of Movies
 * @requires token bearer
 */
// return list of movies
app.get("/movies", (req, res) => {
    Movies.find().then((movies) => res.status(201).json(movies)).catch((err) => { console.error(err); res.status(500).send("Error " + err) })
});
/**
 * Single movie
 * @name Get movie by title
 * @kind function
 * @return movie by title
 * @requires token bearer
 */
// return data by title
app.get('/movies/:title', transAuth, (req, res) => {
    Movies.findOne({ Title: req.params.title }).then((movie) => res.status(200).json(movie)).catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err)
    })
});
/**
 * movie genre
 * @name  filter movie by genre
 * @kind function
 * @return movie by genre
 * @requires token bearer
 */
// return data by genre
app.get("/movies/genre/:genre", transAuth, (req, res) => {
    Movies.find({ "Genre.Name": req.params.genre }).then((movie) => res.status(200).json(movie)).catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err)
    })
})
/**
 * movie director
 * @name  Filter movie by director
 * @kind function
 * @return movie by director
 * @requires token bearer
 */
//return data by director
app.get("/movies/directed/:directed", transAuth, (req, res) => {
    Movies.find({ "Director.Name": req.params.directed }).then((movie) => res.status(200).json(movie)).catch((err) => {
        console.error(err);
        res.status(500).send("Error " + err)
    })
}
)
/**
 * User
 * @name  find User
 * @kind function
 * @return user by name
 * @requires token bearer
 */
app.get('/users/:Username', transAuth, (req, res) => {
    Users.findOne({ Username: { $all: req.params.Username } }).then((user) => {
        res.status(200).json(user)
    })
        .catch((err) => {
            console.log(err)
            res.status(500).send("Error" + err)
        })
})
/**
 * Users
 * @name Userlist
 * @kind function
 * @return Userlist
 * @requires token bearer
 */
app.get('/users', transAuth, (req, res) => {
    //app.get("/users", function (req, res) {
    Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
/**
 * Register
 * @name Register User
 * @kind function
 */
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
/**
 * Update user
 * @name Update User
 * @kind function
 * @return updated user
 * @requires bearer token
 */
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
/**
 * Delete User
 * @name Delete User
 * @kind function
 * @return Delete User
 * @requires bearer token
 */

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

app.listen(PORT, '0.0.0.0', () => {
    console.log('Listening on Port ' + PORT);
});
