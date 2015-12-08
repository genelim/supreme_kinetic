module.exports = function (connection) {
  	var mongoose = require('mongoose'),
  	   	Schema = mongoose.Schema;

  	var user_role = new Schema({
  		type: {type: String, require: true},
        level: {type: Number, require: true}
  	});

  	return connection.model('User_Role', user_role);
}