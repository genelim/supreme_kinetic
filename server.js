var	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	port = process.env.PORT || 8080; 
	
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/libs', express.static(__dirname + '/public/libs'));

app.all('/*', function(req, res, next) {
    res.sendFile('/public/index.html', { root: __dirname });
});

app.use(bodyParser.json()); 

require('./app/routes.js')(app);

app.listen('8080');
console.log('The magic happens on port 8080');
