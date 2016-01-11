'use strict'

angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$rootScope','$scope','Product','cfpLoadingBar','$http'];

function HomeController($rootScope,$scope,Product,cfpLoadingBar,$http) { 
	var vm = this;
    vm.category_type='outdoor';
    vm.products = [];
    vm.size = 4;
    vm.view_details = view_details;
    vm.product_get = product_get;
    vm.select_category = select_category;
    vm.product_get_recommended = product_get_recommended;
    vm.product_get_recommended = product_get_recommended;
    vm.product_recommended = [];
    vm.product_details = []

    $rootScope.home_default = true;
    vm.tab_menu = 	[
					    {name:'Outdoor',disabled:'',active:'active',id:'outdoor', icon:'event_seat'},
					    {name:'Indoor',disabled:'',active:'',id:'indoor',icon:'opacity'}
				   	];
                    
    angular.element(document).ready(function () {
        $('ul.tabs').tabs();
        vm.product_get();
        vm.product_get_recommended();
    });

    function product_get(){
        cfpLoadingBar.start();
        Product.get({page : 1, size:vm.size, type:vm.category_type, location:'admin'},function(res){
            vm.products = (res.response.product);
            vm.done = true;
            cfpLoadingBar.complete();
        });
    }

    function product_get_recommended(){
        $http.get('/api/product_recommended').success(function(product){
            vm.product_recommended = product.response;
        })
    }

    function select_category(type){
        vm.products = null;
        vm.category_type = type.toLowerCase();
        vm.product_get();
    }

    function view_details(details){
        vm.product_details = details;
        $('#view_details').openModal();
    }

    
}