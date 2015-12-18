angular
	.module('app')
	.controller('AdminDashboardController', AdminDashboardController);

AdminDashboardController.$inject = ['$rootScope'];

function AdminDashboardController($rootScope) {
	var vm = this;
	angular.element(document).ready(function () {
        $rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];
        $rootScope.home_default = false;
    });
}