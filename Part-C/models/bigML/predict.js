var bigml = require('bigml');
var fs = require("fs");

//dont forget to change name and id to your user
// var connection = new bigml.BigML('OFIRRR999','bce5e228c27e09db2e07949f5943d097f110c368')
var connection = new bigml.BigML('LIORATIYA','4084760438bee80f1b62c41d3ffaeeb7f3eb7751')

var prediction = new bigml.Prediction(connection);

fs.readFile('model.txt', 'utf8', function(err, data){
    "id","firstName","lastName","phone","city","gender","age","prevCalls","totalTime","product","topic"
    prediction.create(data, {"id": "4591928","firstName": "Joy","lastName": "Goodwin","phone": "(555)","city": "Ashkelon","gender": "Female","age": 23,"prevCalls": 10,"totalTime": 50.946},function(error, prediction) { 
        console.log(prediction.object.output); //Output of prediction
    }); 
});