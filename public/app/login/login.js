angular
    .module('app')
    .controller('LoginController', LoginController);

function LoginController() { 
	var vm = this;
    vm.login = login;
    vm.register = register;

    function login() {
    	$('#user_open').openModal({
    	 	ready: function(){
    	 		$('ul.tabs').tabs('select_tab', 'login');
    	 	}
    	});
    }
    function register(){
    	$('#user_open').openModal({
    	 	ready: function(){
    	 		$('ul.tabs').tabs('select_tab', 'register');
    	 	}
    	});
    }   
}