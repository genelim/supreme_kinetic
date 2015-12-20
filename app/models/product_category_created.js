module.exports = function (connection) {
  	var mongoose = require('mongoose'),
        User = mongoose.model('User').schema,
  	   	Schema = mongoose.Schema;

  	var product_category_created = new Schema({
  		date: { type : Date, default: Date.now },
  		user: { type: Schema.Types.ObjectId, ref: 'User' }
  	});

  	return connection.model('Product_Category_Created', product_category_created);
}