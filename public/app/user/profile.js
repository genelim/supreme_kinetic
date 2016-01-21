angular
	.module('app')
	.controller('ProfileSettingController', ProfileSettingController);

ProfileSettingController.$inject = ['Logger','$scope'];

function ProfileSettingController(Logger,$scope) {
	var vm = this;
	vm.check_social = true;
    if(Logger.is_logged){
        vm.username = Logger.user_details;
        for(var i = 0; i < vm.username.type.length; i++){
        	if(vm.username.type[i].name.indexOf('local') > -1){
        		vm.check_social = false
        	}
        }
    }

}