const express = require("express");
const cors = require("cors");
const path = require("path");
const { EventEmitter } = require("events");
const bodyParser = require("body-parser");
const sockets = require("./socket");

global.round = new EventEmitter();
global.games = {};
global.BONUS = 250;
global.MAX_POINTS = 500;

const app = express();

// CORS
// TODO Make this more secure
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "../client/dist")));

// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const server = app.listen(process.env.PORT || 5000, process.env.IP, () => {
  console.log(`Server listening on port ${server.address().port}`);
});

sockets.init(server);
