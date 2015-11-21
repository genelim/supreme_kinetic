angular
    .module('app')
    .controller('LoginController', LoginController);

function LoginController() { 
	var vm = this;
    vm.login = login;

    function login() {
    	alert('Login');
    }
    
}