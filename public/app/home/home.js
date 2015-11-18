angular
    .module('app')
    .controller('HomeController', HomeController);

function HomeController($mdSidenav) { 
	var vm = this;
    vm.title = "Supreme Kinetic";
}