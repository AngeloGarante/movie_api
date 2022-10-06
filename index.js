const express = require("express");
const morgan = require("morgan");
const app = express();
const bodyParser = require('body-parser'),
    methodOverride = require('method-override');
app.use(morgan("common"));
let movieSelection = [
    {
        title: "Lord of the Ring :Fellowship of the Ring",
        directed: "Peter Jackson",
        based: "The Fellowship of the Ring by J. R. R. Tolkien",
        year: "2001"
    },
    {
        title: "The Lord of the Rings: The Two Towers",
        directed: "Peter Jackson",
        based: "The Two Towers by J. R. R. Tolkien",
        year: "2002"
    },
    {
        title: "The Lord of the Rings: The Return of the King",
        directed: "Peter Jackson",
        based: "The Return of the King by J. R. R. Tolkien",
        year: "2003"

    },
    {
        title: "Independence Day",
        directed: "Roland Emmerich",
        script: "Roland Emmerich, Dean Devlin",
        year: "1996"
    },
    {
        title: "Ready Player One",
        directed: "Steven Spielberg",
        script: "Ernest Cline, Zak Penn",
        year: "2018"
    },
    {
        title: "interstellar",
        directed: "Christopher Nolan",
        script: "Jonathan Nolan, Christopher Nolan",
        year: "2014"
    },
    {
        title: "Alita: Battle Angel",
        directed: "Robert Rodriguez",
        script: "James Cameron, Laeta Kalogridis",
        year: "2019"
    },
    {
        title: "Dune",
        directed: "Denis Villeneuve",
        based: "Dune by Frank Herbert(1965)",
        year: "2021"
    },
    {
        title: "Prometheus",
        directed: "Ridley Scott",
        script: "Jon Spaihts, Damon Lindelof",
        year: "2012"

    },
    {
        title: "Alien: Covenant",
        directed: "Ridley Scott",
        script: "John Logan, Dante Harper",
        year: "2017"
    },]
app.get("/", (req, res) => {
    res.send("My best Sci/fi Movies")
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