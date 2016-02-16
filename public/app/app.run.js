angular
    .module('app')
    .run(runBlock);

runBlock.$inject = ['$rootScope','Logger','Transaction'];

function runBlock($rootScope,Logger,Transaction) {
	$rootScope.home_default = true;
	$rootScope.user_menu = [];
    $rootScope.username = null;
    $rootScope.profile_image = null;
	$rootScope.cart_quantity = 0;
	if(Logger.is_logged){
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
	}else{
		$rootScope.cart_quantity = 0;
	}
}