module.exports = function (connection) {
  	var mongoose = require('mongoose'),
        User = mongoose.model('User').schema,
  	   	Schema = mongoose.Schema;

  	var product_history_view = new Schema({
  		date: { type : Date, default: Date.now },
  		user: [User]
  	});

  	return connection.model('Product_History_View', product_history_view);
}