angular
	.module('app')
	.controller('AdminProductController', AdminProductController);

AdminProductController.$inject = ['$rootScope'];

function AdminProductController($rootScope) {
	var vm = this;
	vm.add_product = add_product;
	vm.add_product_confirm = add_product_confirm;

	$rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];
	$rootScope.home_default = false;
	
	angular.element(document).ready(function () {
        $('ul.tabs').tabs();
    });

    function add_product(){
    	$('#add_product').openModal();
    }

    function add_product_confirm(){

    }
}