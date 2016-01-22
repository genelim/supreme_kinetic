module.exports = function (connection) {
  	var mongoose = require('mongoose');
      	Schema = mongoose.Schema;
    
  	var address = new mongoose.Schema({
		address_1: String,
		address_2: String,
		postcode: String,
		city: String,
		state: String,
        
	});

  	return connection.model('Address', address);
}