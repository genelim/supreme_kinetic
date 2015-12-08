module.exports = function (connection) {
  	var mongoose = require('mongoose'),
        User = mongoose.model('User').schema;
  	   	Schema = mongoose.Schema;

  	var product_discount = new Schema({
  		date: Date,
  		percentage: Number,
        days: Date,
  		discount_validate: Boolean,
  		selected_user: [User]
  	});

  	return connection.model('Product_Discount', product_discount);
}