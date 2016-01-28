angular
	.module('app')
	.controller('AddressController', AddressController);

AddressController.$inject = ['User','Logger'];

function AddressController(User,Logger) {
	var vm = this;
	vm.user = Logger.user_details;
	vm.address_update = address_update;

	vm.state = ['Perlis','Kedah','Pulau Pinang','Perak','Terengganu','Kelantan','Pahang','Selangor','Negeri Sembilan','Melaka','Johor','Sabah','Sarawak'];
	function address_update(user){
		user.types = 'address';
		User.update({_id:user._id},user, function(res) {
			console.log(res)
            if(res.response === 'Server Error'){
            	Materialize.toast('Server Error', 2000);
            	return;
            }
            if(res.response.updated.nModified === 1){
            	Materialize.toast('Account Updated', 2000);
            	vm.user = res.response.user;
            }
        });
	}
}