const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require('body-parser'),
    uuid = require("uuid");
const { toString } = require("lodash");
const { json } = require("body-parser");
methodOverride = require('method-override');
app.use(bodyParser.json());
app.use(morgan("common"));
let users = [
    {
        name: "Marco",
        id: 1,
        favorite: ["the day after tomorrow",]

    }
]
let movieSelection = [
    {
        title: "Lord of the Ring :Fellowship of the Ring",
        directed: "Peter Jackson",
        based: "The Fellowship of the Ring by J. R. R. Tolkien",
        year: "2001",
        genre: "Fantasy"
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        directed: "Peter Jackson",
        based: "The Two Towers by J. R. R. Tolkien",
        year: "2002",
        genre: "Fantasy"
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        directed: "Peter Jackson",
        based: "The Return of the King by J. R. R. Tolkien",
        year: "2003",
        genre: "Fantasy"

    },
    {
        title: "Independence Day",
        directed: "Roland Emmerich",
        script: "Roland Emmerich, Dean Devlin",
        year: "1996",
        genre: "Sci-fy"
    },
    {
        title: "Ready Player One",
        directed: "Steven Spielberg",
        script: "Ernest Cline, Zak Penn",
        year: "2018",
        genre: "Cyberpunk"
    },
    {
        title: "interstellar",
        directed: "Christopher Nolan",
        script: "Jonathan Nolan, Christopher Nolan",
        year: "2014",
        genre: "Sci-fy"
    },
    {
        title: "Alita: Battle Angel",
        directed: "Robert Rodriguez",
        script: "James Cameron, Laeta Kalogridis",
        year: "2019",
        genre: "Sci-fy"
    },
    {
        title: "Dune",
        directed: "Denis Villeneuve",
        based: "Dune by Frank Herbert(1965)",
        year: "2021",
        genre: "Sci-fy"
    },
    {
        title: "Prometheus",
        directed: "Ridley Scott",
        script: "Jon Spaihts, Damon Lindelof",
        year: "2012",
        genre: "Sci-fy"

    },
    {
        title: "Alien: Covenant",
        directed: "Ridley Scott",
        script: "John Logan, Dante Harper",
        year: "2017",
        genre: "Sci-fy"
    },]
//Home page
app.get("/", (req, res) => {
    res.send("Please visit URL//public/documentation.html");
});
// return list of movies
app.get("/movies", (req, res) => {
    res.json(movieSelection);
});
// return data by title
app.get('/movies/:title', (req, res) => {
    res.send(movieSelection.find((movie) => { return movie.title === req.params.title }));
});
// return data by genre
app.get("/movies/genre/:genre", (req, res) => {
    let genreView = req.params.genre;
    res.send(movieSelection.filter((movie) => movie.genre === genreView))
})
//return data by director
app.get("/movies/directed/:directed", (req, res) => {
    const director = req.params.directed
    res.send(movieSelection.filter((movie) => movie.directed === director))
}
)
// create new user
app.post('/users', (req, res) => {
    let newUser = {
        id: uuid.v4(),
        name: req.body,
        favorite: []
    }
    if (!newUser.name) { return res.status(400).send("missing Name"); }
    users.push(newUser);
    res.status(200).json(newUser);
})
//change name
app.put("/users/:name", (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    if (!user.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    }
    else {
        const newUsername = req.body;
        user.name = newUsername
        res.status(201).send(newUsername);
    }
})
//add favorite
app.put('/users/:name/favorite/', (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    if (user) {
        imputMovie = req.body
        res.status(201).send(req.params.name + " has added as is new favorite Movie " + imputMovie)
    } else {
        res.status(404).send('User ' + req.params.name + ' was not found.');
    }
});
app.delete("/users/:name/favorite/deleteFavorite", (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    if (user) {
        deleteMovie = req.body
        res.status(201).send(req.params.name + " has deleted " + imputMovie + " from his list")
    } else {
        res.status(404).send('User ' + req.params.name + ' was not found.');
    }

})
// delete account
app.delete("/users/:name/deregister", (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    if (user) {
        res.status(201).send(req.params.name + " deleted his account ")
    } else {
        res.status(404).send('User ' + req.params.name + ' was not found.');
    }

})

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

app.listen(8080, () => {
    console.log("console test on port 8080")
})