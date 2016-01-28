angular
	.module('app')
	.controller('CartController', CartController);

CartController.$inject = ['Transaction','Logger'];

function CartController(Transaction,Logger) {
	var vm = this;
	Transaction.get({id:Logger.user_details._id},function(res){
        if(res.response === 'Server Error'){
            Materialize.toast('Please refresh the page and try again', 2000);
        }else if(res.response == 0){
            vm.status = 'No Product'
        }else{
            vm.product = res.response;
        }
    })
}