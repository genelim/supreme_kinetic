angular
	.module('app')
	.controller('BrowseMoreController', BrowseMoreController);

BrowseMoreController.$inject = ['$stateParams','Product','cfpLoadingBar'];

function BrowseMoreController($stateParams, Product, cfpLoadingBar) {
	var vm = this;
	vm.get_products = get_products;
	vm.view_details = view_details;
	vm.size = 20;
	vm.products = null;
	vm.product_details = null;

	angular.element(document).ready(function () {
        $('.collapsible').collapsible({
      		accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    	});
    	vm.get_products();
    });

    function get_products(){
        cfpLoadingBar.start();
    	Product.get({page : 1, size:vm.size, type:$stateParams.category, location:'admin'},function(res){
            vm.products = (res.response.product);
            cfpLoadingBar.complete();
        });
    }

    function view_details(product){
    	vm.product_details = product;
    	$('#browse_more_view').openModal();
    }
}