const express = require('express');
const path = require('path');
const request = require('request');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const port = 3000;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port, () => console.log(`App started on port ` + port));

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
        url: 'http://ec2-184-73-110-34.compute-1.amazonaws.com/waterplants'
    }, function(error, response, body) {
        res.send(response.body);
    })
});

request.get({
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    method: 'GET',
    url: 'http://ec2-184-73-110-34.compute-1.amazonaws.com/waterplants'
}, function(error, response, body) {
    console.log(response.body)
})
