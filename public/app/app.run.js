angular
    .module('app')
    .run(runBlock);

runBlock.$inject = ['$rootScope'];

function runBlock($rootScope) {
	$rootScope.home_default = true;
	$rootScope.user_menu = [];
}