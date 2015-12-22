'use strict'

angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$rootScope','$scope','Product'];

function HomeController($rootScope,$scope,Product) { 
	var vm = this;
    vm.category_type='outdoor';
    vm.products = [];
    vm.size = 4;

    $rootScope.home_default = true;
    vm.tab_menu = 	[
					    {name:'Outdoor',disabled:'',active:'',id:'outdoor', icon:'event_seat'},
					    {name:'Indoor',disabled:'',active:'active',id:'indoor',icon:'opacity'}
				   	];
                    
    angular.element(document).ready(function () {
        $('ul.tabs').tabs();
        Product.get({page : 1, size:vm.size, type:vm.category_type, location:'admin'},function(res){
        vm.products = (res.response.product);
        console.log(vm.products)
        // cfpLoadingBar.complete();
    });
    });

    // Product.get({page : 1, size:vm.size, type:vm.category_type, location:'member'},function(res){
    //     vm.products = (res.response.product);
    //     // cfpLoadingBar.complete();
    // });
}