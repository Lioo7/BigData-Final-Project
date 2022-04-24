const express = require('express');
const app = express();
var server = require('http').createServer(app)
const io = require("socket.io")(server, {
    allowEIO3: true // false by default
});
const kafka = require('./models/comsumeKafka');
const redis = require("./models/redisDB");

const port = 3250
//http://localhost:3250
//--------------Middleware------------------

app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(express.json());


// //**NEED TO INIT AFTER 24 HOURS */
// redis.initDB();
  
io.on("connection", async (socket) => {
    //Get data from redis to dashboard
    let allDataArray = await redis.getAllData();
    console.log(allDataArray[0]+" | "+allDataArray[1]+" | "+allDataArray[2]+" | "+allDataArray[3]+" | "+allDataArray[4]);
    io.emit('allData', 
    {join: allDataArray[0],service: allDataArray[1], complaint: allDataArray[2] , leave: allDataArray[3], waiting: allDataArray[4]});
    {join: await db.get('join'),service: allDataArray[1], complaint: allDataArray[2] , leave: allDataArray[3], waiting: allDataArray[4]});

});

// ------------Consumer from Kafka-----------------
kafka.consumer.on("data", async (msg) => {
    const newCall = JSON.parse(msg.value);

    // **Store the data in Redis and after send to Dashboard */


    if(String(msg.value).length < 100) //Total wating calls
    {
        redis.setTopic('TotalWaiting',parseInt(msg.value));
    }
    else if(String(msg.value).includes("topic")) // Details calls
    {   
        redis.setTopic(newCall.topic,0);
    }

    //Get data from redis to dashboard
    let allDataArray = await redis.getAllData();
    io.emit('allData', 
    {join: allDataArray[0],service: allDataArray[1], complaint: allDataArray[2] , leave: allDataArray[3], waiting: allDataArray[4]});
});


//----------------Front Side - Daily Call Center ------------------

app.get('/', function (req, res) {
    res.render(__dirname + '/views/dashboard/pages/dashboard');
})

// where style files will be
app.use('/', express.static('./views/dashboard'))

//------------------------------------------------

server.listen(port, () => console.log(`Server B is listening at http://localhost:${port}`));
