angular
    .module('app')
    .controller('LoginController', LoginController);

function LoginController(User) { 
	var vm = this;
    vm.login = login;
    vm.register = register;
    vm.register_press = register_press;
    vm.login_press = login_press;

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
    function register_press(value){
        value.type = 'local';
        User.save(value, function(res){
            console.log(res)
        });
    }

    function login_press(value){
        console.log(value);
        value.type = 'login';
        User.save(value, function(res){
            console.log(res)
        })
    }
}