angular
	.module('app')
	.controller('InformationController', InformationController);

InformationController.$inject = ['User','Logger','User'];

function InformationController(User,Logger,User) {
	var vm = this;
	vm.user = Logger.user_details;
	vm.information_update = information_update;

	function information_update(user){
		user.types = 'information';
		if(user.phone === ''){
			user.phone === null;
		}
		if(isNaN(user.phone)){
			Materialize.toast('Phone must be number only', 2000);
			return;
		}
		if(user.first_name === ''){
			Materialize.toast('First name is required', 2000);
			return;
		}
		if(!user.last_name || user.last_name === ''){
			Materialize.toast('Last name is required', 2000);
			return;
		}
		User.update({_id:user._id},user, function(res) {
            if(res.response === 'Server Error'){
            	Materialize.toast('Server Error', 2000);
            	return;
            }
            if(res.response.updated.nModified === 1){
            	Materialize.toast('Account Updated', 2000);
            	Logger.user_details = res.response.user;
            }
        });
	}
}