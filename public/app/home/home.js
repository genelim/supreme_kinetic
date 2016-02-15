'use strict'

angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$rootScope','$scope','Product','cfpLoadingBar','$http','Transaction','Logger'];

function HomeController($rootScope,$scope,Product,cfpLoadingBar,$http,Transaction,Logger) { 
	var vm = this;
    vm.category_type='outdoor';
    vm.products_outdoor = [];
    vm.products_indoor = [];
    vm.size = 4;
    vm.view_details = view_details;
    vm.select_category = select_category;
    vm.product_get_recommended = product_get_recommended;
    vm.product_recommended = [];
    vm.product_details = []
    vm.add_to_cart = add_to_cart;
    $scope.dd = 'ddd';
    vm.selected_image = null;
    vm.select_image = select_image;
    vm.color = null;
    vm.product = {select_quantity:1};
    vm.size_product = null;
    vm.type_select = type_select;

    $rootScope.home_default = true;
    vm.tab_menu = 	[
					    {name:'Outdoor',disabled:'',active:'active',id:'outdoor', icon:'event_seat'},
					    {name:'Indoor',disabled:'',active:'',id:'indoor',icon:'opacity'}
				   	];
                    
    angular.element(document).ready(function () {
        $('ul.tabs').tabs();
        product_get('outdoor');
        product_get('indoor');
        vm.product_get_recommended();
        $('.next_new').click(function(){
            $('.slider').slider('next');
        });
        $('.prev_new').click(function(){
            $('.slider').slider('prev');
        });
        setTimeout(function(){
            $('.slider').slider({full_width: true,indicators:false}); 
        }, 300);
    });

    function product_get(type){
        cfpLoadingBar.start();
        Product.get({page : 1, size:vm.size, type:type, location:'admin'},function(res){
            console.log(res)
            if(type === 'outdoor')
                vm.products_outdoor = (res.response.product);
            else if(type === 'indoor')
                vm.products_indoor = (res.response.product);
            
            vm.done = true;
            cfpLoadingBar.complete();
        });
    }

    function product_get_recommended(){
        $http.get('/api/product_recommended').success(function(product){
            vm.product_recommended = product.response;
            console.log(vm.product_recommended)
            
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
        if(vm.color === null){
            if(product.color.length > 0){
                Materialize.toast('Please select color', 2000);
                return;
            }else{
                vm.color = null;
            }   
        }
        if(vm.size_product === null){
            if(product.size.length > 0){
                Materialize.toast('Please select size', 2000);
                return;
            }else{
                vm.size = null;
            } 
        }
        if(Logger.is_logged){
            var data = {user:Logger.user_details,product:product,quantity:quantity,size:vm.size_product,color:vm.color};
            Transaction.save(data, function(result){
                Materialize.toast('Added to Cart', 2000);
                Transaction.get({id:Logger.user_details._id},function(res){
                    if(res.response === 'Server Error'){
                        Materialize.toast('Please refresh the page and try again', 2000);
                    }else if(res.response == 0){
                        $rootScope.cart_quantity = 0;
                    }else{
                        var count = 0;
                        angular.forEach(res.response.product, function(item) {
                            if(item.product_id.length){
                                count += 1;
                            }
                        })
                        $rootScope.cart_quantity = count;
                    }
                })
                vm.product = {select_quantity:1};
                vm.color =null;
                vm.size_product =null;
            })
        }else{
            Materialize.toast('You are not logged in', 2000);
        }
        
    }

    function select_image(image){
        vm.selected_image = image;
    }

    function type_select(type,data){
        if(type === 'color'){
            vm.color = data;
        }else if(type === 'size'){
            vm.size_product = data;
        }
    }
}