module.exports = function (connection) {
  	var mongoose = require('mongoose');
  	var Schema = mongoose.Schema;

    var role = new Schema({
        type: String,
        level: Number,
    });
    
  	var user = new mongoose.Schema({
		first_name: String,
		last_name: String,
        email: String,
        password: String,
        profile_image: String,
		company_name: String,
		created_at: { type : Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'User' },
        role: [role]
	});

  	return connection.model('User', user);
}