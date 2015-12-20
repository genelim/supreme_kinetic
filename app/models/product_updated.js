module.exports = function (connection) {
  	var mongoose = require('mongoose'),
        User = mongoose.model('User').schema;
  	   	Schema = mongoose.Schema;

  	var product_updated = new Schema({
  		date: { type : Date, default: Date.now },
  		user: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  	});

  	return connection.model('Product_Updated', product_updated);
}