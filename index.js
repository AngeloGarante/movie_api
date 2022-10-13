const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require('body-parser'),
    uuid = require("uuid");
const { toString } = require("lodash");
methodOverride = require('method-override');
app.use(bodyParser.json());
app.use(morgan("common"));
let users = [
    {
        id: 1,
        name: "dummyName",
        favorite: []

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
    res.send("Home Page");
});
// return list of movies
app.get("/movies", (req, res) => {
    res.json(movieSelection);
});
// return data by title
app.get('/movies/:title', (req, res) => {
    res.send(movieSelection.find((movie) => { return movie.title === req.params.title }));
});
//i tried to tinker with filter but it doesnt work , 
app.get("/movies/:genre", (req, res) => {
    genreView = req.params.genre
    res.send(movieSelection.filter(genreView))
})
app.get("/movies/:directed", (req, res) => {
    res.send(movieSelection.find((movie) => {
        genreView = req.params.genre
        res.json(genreView)
    }))
})
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});
app.put("/users/:name", (req, res) => {
    let user = users.find((user) => { return user.name === req.params.name });
    if (!user) {
        const message = 'Missing name in request body';
        res.status(400).send(message);
    }
    else {
        user.name = newUsername
        res.status(201).send(newUsername);
    }
})

app.get('/documentation', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirnamenod });
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