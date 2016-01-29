'use strict'

angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$rootScope','$scope','Product','cfpLoadingBar','$http','Transaction','Logger'];

function HomeController($rootScope,$scope,Product,cfpLoadingBar,$http,Transaction,Logger) { 
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
    vm.add_to_cart = add_to_cart;
    $scope.dd = 'ddd';
    vm.selected_image = null;
    vm.select_image = select_image;

    $rootScope.home_default = true;
    vm.tab_menu = 	[
					    {name:'Outdoor',disabled:'',active:'active',id:'outdoor', icon:'event_seat'},
					    {name:'Indoor',disabled:'',active:'',id:'indoor',icon:'opacity'}
				   	];
                    
    angular.element(document).ready(function () {
        $('ul.tabs').tabs();
        vm.product_get();
        vm.product_get_recommended();
        $('.slider').slider({full_width: true,indicators:false});
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
        vm.selected_image = vm.product_details.image[0];
        $('#view_details').openModal();
    }

    function add_to_cart(product,quantity){
        if(angular.isUndefined(quantity) || quantity === null || quantity === ''){
            Materialize.toast('Please fill in quantity to add', 2000);
            return;
        }
        if(isNaN(quantity)){
            Materialize.toast('Quantity must be integer', 2000);
            return;
        }
        if(Logger.is_logged){
            var data = {user:Logger.user_details,product:product,quantity:quantity};
            Transaction.save(data, function(result){
                Materialize.toast('Added to Cart', 2000);
                Transaction.get({id:Logger.user_details._id},function(res){
                    if(res.response === 'Server Error'){
                        Materialize.toast('Please refresh the page and try again', 2000);
                    }else if(res.response == 0){
                        $rootScope.cart_quantity = 0;
                    }else{
                        $rootScope.cart_quantity = res.response.product.length;
                    }
                })
            })
        }else{
            Materialize.toast('You are not logged in', 2000);
        }
        
    }

    function select_image(image){
        vm.selected_image = image;
    }
}