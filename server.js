var	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 8080; 

app.use(bodyParser.json());   
app.use(express.static(__dirname + '/public'));
require('./app/routes.js')(app);

app.listen('8080');
