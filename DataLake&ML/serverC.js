const express = require('express');
const app = express();
var server = require('http').createServer(app);
const io = require("socket.io")(server, {
    allowEIO3: true // false by default
});
var fs = require("fs");
const BigML = require('./models/bml');
const mongodb = require('./models/MongoDB/mongodb');
// const kafka = require("./models/comsumeKafka");

const controllerRouter = require('./routes/controller'); //controller

const port = 3000
//http://localhost:3245

//--------------Middleware------------------

app.set('view engine', 'ejs');
app.use(express.static('./views/Prediction_Table_Responsive'));
app.use(express.json());

//------------Consumer from Kafka-----------------

// var newcall = "Waiting for new call...";

// io.on("connection", (socket) => {
//     kafka.consumer.on("data", (msg) => {
//         if(String(msg.value).includes("topic")){ //Data for MongoDB
            
//             mongodb.saveDetailCall(msg);

//         }
//         else{ //Data for predict in BigML
//             const newCall = JSON.parse(msg.value);
//             socket.emit("NewCall", 
//             {firstname: newCall.firstName, lastname: newCall.lastName, phone: newCall.phone, city: newCall.city, gender: newCall.gender, age: newCall.age, prevcalls: newCall.prevCalls});
//             newcall = msg.value;
//         }

//     });

//     //** FOR CHECK!!!! */
//     const newCall = {
//         "id:": 123456,
//         "firstName": "Ben",
//         "lastName": "Cohen",
//         "phone": "0502324534",
//         "city": "Tel-Aviv",
//         "gender": "Male",
//         "age": 18,
//         "prevCalls": 10,
//         };
//     socket.emit("NewCall", 
//     {firstname: newCall.firstName, lastname: newCall.lastName, phone: newCall.phone, city: newCall.city, gender: newCall.gender, age: newCall.age, prevcalls: newCall.prevCalls});
// });

//----------------Front side ------------------

app.use('/', controllerRouter);

//-------- Socket.io ----------------
io.on("connection", (socket) => {

    socket.on("Train", async (msg) => {  
        var res = await BigML.createModel();
        setTimeout(function(){
            socket.emit("Model", res);
        }, 10000);
    });

    socket.on('Predict', async (msg) => 
        {await BigML.predict(newcall);
        setTimeout(function(){
            fs.readFile('predict.txt', 'utf8', function(err, data){
                socket.emit("Prediction", data);
            });
        }, 3000);
    });

});

server.listen(port, () => console.log(`BigML app listening at http://localhost:${port}`));