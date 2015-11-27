var	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 8080; 
	 
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); 

require('./app/routes.js')(app);

app.listen('8080');
console.log('The magic happens on port 8080');
