module.exports = function (connection) {
  	var mongoose = require('mongoose'),
  	   	Schema = mongoose.Schema;

  	var product_category = new Schema({
  		sub_category: String
  	});

  	return connection.model('Product_Category', product_category);
}