angular
	.module('app')
	.controller('CartController', CartController);

CartController.$inject = ['Transaction','Logger','$http','$state'];

function CartController(Transaction,Logger,$http,$state) {
	var vm = this;
    vm.cart_remove = cart_remove;
    vm.product = [];
    vm.total = total;
    vm.update_cart = update_cart;
    get_cart();

    function get_cart(){
        if(Logger.user_details){
            Transaction.get({id:Logger.user_details._id},function(res){
                if(res.response === 'Server Error'){
                    Materialize.toast('Please refresh the page and try again', 2000);
                }else if(res.response == 0){
                    vm.status = 'No Product'
                }else{
                    vm.product = res.response;
                    console.log(vm.product)
                }
            })
        }
        
    }
	
    function cart_remove(product){
        var data = {id:product._id,product:vm.product}
        Transaction.update({id:product._id},data, function(res){
            if(res.response === 'Server Error'){
                Materialize.toast('Please refresh the page and try again', 2000);
            }else{
                get_cart();
            }
        })
    }

    function total() {
        var total = 0;
        angular.forEach(vm.product.product, function(item) {
            total += item.quantity * item.product_id[0].price;
        })

        return total;
    }

    function update_cart(location){
        $http.put('api/cart_update', vm.product)
        .then(function(res){
            if(res.statusText === 'OK' ){
                $state.go(location)
            }
        });
    }
}