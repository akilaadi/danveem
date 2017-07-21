var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    bodyParser = require('body-parser'),
    env = require('node-env-file');

env(__dirname + '/.env');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./routes.js');
routes(app);


app.listen(port);

console.log('danveem RESTful API server started on: ' + port);