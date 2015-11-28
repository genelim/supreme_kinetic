angular
	.module('app')
	.controller('AdminController', AdminController);

AdminController.$inject = ['$rootScope'];

function AdminController($rootScope) {
	var vm = this;
	$rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];

	$rootScope.home_default = false;
	vm.title ='Coming Soon';
}