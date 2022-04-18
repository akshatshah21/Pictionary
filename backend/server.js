const express = require('express');
const { EventEmitter } = require('events');
const bodyParser = require("body-parser");
const sockets = require('./socket');

global.round = new EventEmitter();
global.games = {};
global.BONUS = 250;
global.MAX_POINTS = 500;

const app = express();
// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
    extended: false,
    })
);
app.use(bodyParser.json());



app.get('/', (req, res) => {
    // const roomID = req.query.id;
    // res.render('index', { roomID });
    return res.json("hello")
});


const server = app.listen(process.env.PORT || 3000, process.env.IP, () => {
    console.log(`Server listening on port ${server.address().port}`);
});

sockets.init(server);