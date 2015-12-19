module.exports = function (connection) {
  	var mongoose = require('mongoose'),
        Product_Category_Created = mongoose.model('Product_Category_Created').schema,
  	   	Schema = mongoose.Schema;

  	var product_category = new Schema({
  		sub_category: String,
  		created: [Product_Category_Created]
  	});

  	return connection.model('Product_Category', product_category);
};