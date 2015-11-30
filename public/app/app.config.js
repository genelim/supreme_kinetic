angular
    .module('app')
    .config(config);

config.$inject = ['$routeProvider','$locationProvider'];

function config($routeProvider,$locationProvider) {
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
    $locationProvider.html5Mode(true);
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