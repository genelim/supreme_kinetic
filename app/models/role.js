module.exports = function (connection) {
  	var mongoose = require('mongoose');
  	var Schema = mongoose.Schema;

  	var role = new Schema({
  		type: String,
        level: Number,
  	});

  	return connection.model('Role', role);
}