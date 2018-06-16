const express = require('express');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const bcrypt = require('bcrypt');
const saltRounds = 10;
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const db_env = process.env;
var db;

const port = 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(getURI(), {native_parser:true}, function(err, client) {
    if (err) throw err;
    db = client.db("server-pass");
    if(db != null) {
        app.listen(port, () => console.log(`App started on port ` + port));
    }
    else {
        console.log("Could not connect to database");
    }
});

app.get('/login', function(req, res) {
    retrievePasswordHash("trentliu92").then(response => {
        bcrypt.compare("userpass", response, function(err,res){
            console.log(res);
        });
    });
});

function getURI() {
    return "mongodb://" + db_env.DB_USER + ":" + db_env.DB_PASS + "@" + db_env.DB_URI;
}

function updatePassword(username, password) {
    return new Promise(function(resolve, reject){
        bcrypt.hash(password, saltRounds)
        .then(function(hash){
            let collection = db.collection("pass-collection");
            collection.update({"user_name":username}, {$set: {password:hash}}, function(err, result){
                if(err) reject(err);
                resolve(true);
            });
        });
    });
}

function retrievePasswordHash(username) {
    return new Promise(function(resolve, reject){
        let collection = db.collection("pass-collection");
        collection.findOne({"user_name":username}, function(err, result){
            if(err) throw err;
            resolve(result.password);
        });
    });
}

app.get('/', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.send("home");
});

app.get('/getweather', function(req, res){
    res.header("Access-Control-Allow-Origin", "*");
    res.send("home");
});

app.get('/waterplants', function(req, res) {
    request.get({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        method: 'GET',
        url: 'http://10.0.0.245:1337/waterplants'
    }, function(error, response, body) {
        res.send(response.body);
    })
});

// request.get({
//     headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//     },
//     method: 'GET',
//     url: 'http://ec2-184-73-110-34.compute-1.amazonaws.com/waterplants'
// }, function(error, response, body) {
//     console.log(response.body)
// })

