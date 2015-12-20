module.exports = function (connection) {
  	var mongoose = require('mongoose'),
        User = mongoose.model('User').schema,
  	   	Schema = mongoose.Schema;

  	var product_discount = new Schema({
  		date: Date,
        days: Number,
        discount_code: String,
        discount_validate: Boolean,
        duration_type: String,
  		percentage: Number,
  		selected_user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  	});

  	return connection.model('Product_Discount', product_discount);
};