const express = require('express');
const mysql = require('mysql');
const {faker} = require("@faker-js/faker");

const app = express();

var connection = mysql.createConnection({
    //Properties
    host: 'localhost',
    user: 'root',
    password: 'Lior4007',
    database: 'big_data'
});

const randomPerson = () => {
    let id = Math.floor(Math.random() * 1000000000);
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let phone = faker.phone.phoneNumber();
    let city = ['Jerusalem', 'Nahariya', 'Haifa', 'Tel Aviv', 'Ashdod', 'Ashkelon', 'Beer Sheva'];
    const randomCity = city[Math.floor(Math.random() * city.length)];
    let gender = ['Female','Male'];
    let randomGender = gender[Math.floor(Math.random() * gender.length)];
    let age = Math.floor(Math.random() * 100) + 18;

    let person = {id,firstName,lastName,phone,randomCity,randomGender,age};
    return person;
}

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");

    for (let i = 0; i < 30; i++) {

        let person = randomPerson();

        var sql = `INSERT INTO users (id, first_name,last_name,phone,city,gender,age,prev_calls) 
            VALUES (${person.id},'${person.firstName}','${person.lastName}','${person.phone}','${person.randomCity}','${person.randomGender}',${person.age},0);`;

        connection.query(sql, function (err, result) {
          if (err) throw err;
          console.log(`${i+1} record inserted`);
        });
    }

    connection.end();
  });

// connection.query('SELECT * FROM users', (err,rows) => {
//     if(err) throw err;
  
//     console.log('Data received from Db:');
//     console.log(rows);
//   });
