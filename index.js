/***
 * *GET/POST Example * Node.js -> Express -> ejs -> knex
 */
const listenPort = 2145;// also, gives us a constant that we can use throughout the file

/* Requires */
//provides us access to the express library
let express = require("express"); //loads the exress link into the application
//let path = require("path");

/* we do things through and by the instance of Express */
let app = express(); // object of type express

//Static Files
app.use(express.static('public'));
// app.use('/css', express.static(__dirname + '/public/css'));

//post express 4.16, use
app.use(express.urlencoded({ extended: true }));//whenever I do express stuff, this lets me put special chars in the url

//converts ejs format into html pages prior to returning them to browser
app.set("view engine", "ejs");//set the "view engine" to the value of "ejs"

/* initialize the web server on specified port  */
//tells what port to listen on, and has a callback function
app.listen(listenPort, function () {
    console.log("You hear that? It's the the 'winds of change' on port " + listenPort)
});

/* UP TO THIS POINT, YOU NEED THIS CODE TO MAKE 
AN EXPRESS APP USING EJS */

/* set up the database connection via knex */
/* requires installation of sqlite3 and knex */
let knex = require("knex")({
    client: "sqlite3",
    connection: {
        filename: "./Fleet.db"
    },
    useNullAsDefault: true
});

/**************************** ROUTES ****************************/

/*"get" defines a route for express (what you type in browser)
then there's a callback function that says here's what I want
you to do. Then the knex looks like a SQL query a bit. */
app.get('/fleetlist', function (req, res) {
    knex.from("Vehicle").select("*").orderBy("vMake", "vModel", "vYear")
        .then(vehicles => { //this says then create a vehicle called variables
            console.log("Vehicles: " + vehicles.length); //console says how many vehicles we have
            res.render("fleetlist", { fleetList: vehicles }); //get a file called "fleetlist.ejs", then passes it the vehicles list, and calls it fleetList; fleetList = the key, vehicles is the value
        })
        .catch(err => { //if something goes wrong...
            console.log(err); //log it in the console
            res.status(500).json({ err }); //sends error message to browser
        });
});

app.get('/addVehicle', (req, res) => {
    res.render('addVehicle');
});

app.post('/addVehicle', (req, res) => {
    knex('Vehicle').insert(req.body).then(vehicle => {
        res.redirect('/fleetlist'); //change to different route
    })
});

app.get('/updvehicle/:id', (req, res) => {
    knex('Vehicle').where('id', req.params.id)
        .then(results => {
            res.render("updVehicle", { vehicle: results });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err });
        });
});

app.post('/updvehicle', (req, res) => {
    knex('Vehicle').where({ id: req.body.id }).update({
        id: req.body.id, vYear: req.body.vYear,
        vMake: req.body.vMake, vModel: req.body.vModel,
        vMileage: req.body.vMileage })
        .then(vehicle => { res.redirect('/fleetlist'); })
});

app.post('/delVehicle/:id', (req, res) => {
    knex('Vehicle').where('id', req.params.id).del()
        .then(vehicle => {
            res.redirect('/fleetlist');
        }).catch(err => {
            console.log(err);
            res.status(500).json({ err })
        })
});

/* set up a route for a POST request */
app.post('/getform', function (req, res) {
    console.log("POST /getform");
    res.redirect("/getform");
});

app.get('/', function (req, res) {
    console.log("GET /getform");
    res.render('getpost');
});

/* set up route for a GET request */
app.get('/getform', function (req, res) {
    console.log("GET /getform");
    res.render('getpost');
});