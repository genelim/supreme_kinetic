var	express = require('express'),
	app = express(),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	user = require('./app/routes/user'),
	product = require('./app/routes/product'),
	product_category = require('./app/routes/product_category'),
	upload = require('./app/routes/upload');
	transaction = require('./app/routes/transaction');
	port = process.env.PORT || 8080; 
	
app.use(bodyParser.json()); 
app.use('/app', express.static(__dirname + '/public/app'));
app.use('/assets', express.static(__dirname + '/public/assets'));
app.use('/libs', express.static(__dirname + '/public/libs'));

app.post('/api/user', user.post);
app.get('/api/user/:discount', user.discount);
app.get('/api/user/:page/:size/:type', user.get);
app.put('/api/user', user.update);

app.get('/api/product/:page/:size/:type/:location', product.get);
app.get('/api/product_recommended', product.get_recommended);
app.post('/api/product', product.post);
app.put('/api/product', product.put);
app.get('/api/sort_price', product.sort_price);
app.get('/api/sort_category', product.sort_category);
app.get('/api/sort_brand', product.sort_brand);
app.get('/api/product_brand/:type', product.product_brand);
app.get('/api/product_recommended_count', product.product_recommended_count);
app.delete('/api/product/:id', product.deleted);

app.post('/api/upload', upload.image);

app.get('/api/product_category/:type', product_category.get);
app.post('/api/product_category', product_category.post);
app.delete('/api/product_category/:id', product_category.delete);

app.post('/api/transaction', transaction.add_to_cart);
app.get('/api/transaction/:id', transaction.get);

app.all('/*', function(req, res, next) {
    res.sendFile('/public/index.html', { root: __dirname });
});

app.listen('8080');
console.log('The magic happens on port 8080');