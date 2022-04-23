const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server);
var db = require('./models/mysql');
const kafka = require("../MessageBroker/PublishToKafka/publish")

const port = 3022

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//----------------------------------------

app.set('view engine', 'ejs');
app.use(express.static("public"));

//------- Call Generator of users from MySQL -------------
app.get('/', (req, res) => {
    db.query("SELECT * FROM users;", function (err, result, fields) {
        if (err) throw err;
        res.render('index', {data: result})
    });
})

//--- Socket.io - Produce call details to kafka ----------------
io.on("connection", (socket) => {
    console.log("new user connected");
    socket.on("totalWaitingCalls", (msg) => { kafka.publish(msg) });
    socket.on("callDetails", (msg) => { kafka.publish(msg) });
});

server.listen(port, () => console.log(`Call Generator app listening at http://localhost:${port}`));

