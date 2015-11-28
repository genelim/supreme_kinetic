module.exports = function (connection) {
  	var mongoose = require('mongoose'),
  	   	Schema = mongoose.Schema;

  	var role = new Schema({
  		type: {type: String, require: true},
        level: {type: Number, require: true}
  	});

  	return connection.model('Role', role);
}