angular
    .module('app')
    .config(config);

config.$inject = ['$routeProvider'];

function config($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'app/home/home.html',
            controller: 'HomeController',
            controllerAs: 'vm'
        })
        .when('/admin', {
            templateUrl: 'app/admin/admin.html',
            controller: 'AdminController',
            controllerAs: 'vm',
            resolve: {app: check_logged}
        })
        .otherwise({redirectTo:'/'});
}

var check_logged = function(Logger,$q,$location){
	var deferred = $q.defer();
	if(Logger.user_details.role[0].type === 'admin'){
			console.log(Logger);
			deferred.resolve();
		
	}else{
		$location.url('/');
	}
}