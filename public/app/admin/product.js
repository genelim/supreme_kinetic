angular
	.module('app')
	.controller('AdminProductController', AdminProductController);

AdminProductController.$inject = ['$rootScope'];

function AdminProductController($rootScope) {
	var vm = this;
	$rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];
	$rootScope.home_default = false;
	angular.element(document).ready(function () {
        $('ul.tabs').tabs();
    });
}