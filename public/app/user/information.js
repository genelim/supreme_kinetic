angular
	.module('app')
	.controller('InformationController', InformationController);

InformationController.$inject = ['User','Logger'];

function InformationController(User,Logger) {
	var vm = this;
	vm.user = Logger.user_details;
}