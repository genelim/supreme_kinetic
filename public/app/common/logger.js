angular
	.module('app')
	.service('Logger', Logger);

Logger.$inject = ['$localStorage'];

function Logger($localStorage) {
	var user = {
		is_logged: false,
		user_details: [],
		is_admin: false
	}
	user.user_details = $localStorage.user_details;
	if(user.user_details)
		user.is_logged = true;
	return user;
}