module.exports = function (connection) {
  	var mongoose = require('mongoose');
      	Schema = mongoose.Schema,
      	User = mongoose.model('User').schema,
      	Product = mongoose.model('Product').schema;

    var select_product = new mongoose.Schema({
		product_id: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
		quantity: Number    
	});
	
  	var cart = new mongoose.Schema({
		product: [select_product],
		user: { type: Schema.Types.ObjectId, ref: 'User' }    
	});

  	return connection.model('Cart', cart);
}