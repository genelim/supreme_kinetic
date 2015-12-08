var	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	user = require('./app/routes/user'),
	product = require('./app/routes/product'),
	port = process.env.PORT || 8080; 
	
app.use(bodyParser.json()); 
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/libs', express.static(__dirname + '/public/libs'));

app.post('/api/user', user.post);
app.get('/api/user/:discount', user.discount);
app.get('/api/user/:page/:size/:type', user.get);
app.get('/api/user/:type', user.count);

app.get('/api/product', product.get);
app.post('/api/product', product.post);

app.all('/*', function(req, res, next) {
    res.sendFile('/public/index.html', { root: __dirname });
});

app.listen('8080');
console.log('The magic happens on port 8080');