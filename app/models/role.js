module.exports = function (connection) {
  	var mongoose = require('mongoose'),
  	   	Schema = mongoose.Schema;

  	var role = new Schema({
  		type: String,
        level: Number,
  	});

  	role.pre("save",function(next) {
  		this.type = 'member';
  		this.level = 0;
  		
  		next();
	});

  	return connection.model('Role', role);
}