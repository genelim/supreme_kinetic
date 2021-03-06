angular
	.module('app')
	.controller('AdminUserController', AdminUserController);

AdminUserController.$inject = ['$rootScope','User','$scope','cfpLoadingBar'];

function AdminUserController($rootScope,User,$scope,cfpLoadingBar) {
	var vm = this;
	vm.pagination_number = pagination_number;
	vm.display_user = display_user;
	vm.number = 0;
	vm.users = [];
	vm.current_page = 1;
	vm.size = 5;
	vm.type = 'member';
	vm.user_load = user_load;
	vm.next_user_page = next_user_page;
	vm.static_user_page = static_user_page;
	vm.previous_user_page = previous_user_page;

	angular.element(document).ready(function () {
        $('ul.tabs').tabs();
        $rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];
        $rootScope.home_default = false;
    });

	$scope.$on('$viewContentLoaded', function(){
		user_load(vm.type);
    })  

    function user_load(new_type){
    	vm.type = new_type;
    	vm.current_page = 1;
        cfpLoadingBar.start();
    	User.get({page : 1, size:vm.size, type:vm.type},function(res){
			vm.users = (res.response.user);
			vm.number = ( Math.ceil(res.response.count/vm.size));
        	cfpLoadingBar.complete();
		});
    }

    function pagination_number(number){
    	return new Array(number);
    }

    function display_user(page){
    	vm.current_page = page;
        cfpLoadingBar.start();
    	User.get({page : page, size:vm.size, type:vm.type},function(res){
			vm.users = (res.response.user);
        	cfpLoadingBar.complete();
		});   
    }

    function next_user_page(){
    	if(vm.current_page < vm.number){
        	cfpLoadingBar.start();
    		var page = vm.current_page + 1;
	    	User.get({page : page, size:vm.size, type:vm.type},function(res){
				vm.users = (res.response.user);
				vm.current_page = page;
        		cfpLoadingBar.complete();
			});
    	}
    	
    }

    function previous_user_page(){
    	if(vm.current_page > 1){
        	cfpLoadingBar.start();
	    	var page = vm.current_page - 1;
	    	User.get({page : page, size:vm.size, type:vm.type},function(res){
				vm.users = (res.response.user);
				vm.current_page = page
        		cfpLoadingBar.complete();
			});
	    }
    }

    function static_user_page(static){
    	if(static === 0){
    		var page = 1;
    	}else if (static === 1){
    		var page = vm.number;
    	}
        cfpLoadingBar.start();
    	User.get({page : page, size:vm.size, type:vm.type},function(res){
			vm.users = (res.response.user);
			vm.current_page = page
        	cfpLoadingBar.complete();
		});
    }
}