    module.exports = function (connection) {
  	var mongoose = require('mongoose');
      	Schema = mongoose.Schema,
        User_Role = mongoose.model('User_Role').schema,
        Address = mongoose.model('Address').schema,
        bcrypt = require('bcrypt-nodejs');
    
  	var user = new mongoose.Schema({
		first_name: String,
		last_name: String,
        email: String,
        password: String,
        profile_image: String,
        company_name: String,
		type: [{name: { type : String }, id: { type: String }}],
        email_validate: { type : Boolean, default: false },
		created_at: { type : Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'User' },
        role: [User_Role],
        address:  [Address],
        phone: Number
	});

    user.methods.generateHash = function(password) {
        return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    user.methods.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
    };

  	return connection.model('User', user);
}