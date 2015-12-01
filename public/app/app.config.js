angular
    .module('app')
    .config(config);

config.$inject = ['$urlRouterProvider','$stateProvider','$locationProvider'];

function config($urlRouterProvider,$stateProvider,$locationProvider) {
    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('/admin', '/admin/dashboard');
    $urlRouterProvider.when('/admin/', '/admin/dashboard');

    $stateProvider
    .state('home', {
        url:'/',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
    })
    .state('admin', {
        url:'/admin',
        templateUrl: 'app/admin/admin.html',
        resolve: {app: check_logged}
    })
    .state('admin.dashboard', {
        url: '/dashboard',
        templateUrl: 'app/admin/dashboard.html',
        controller: 'AdminDashboardController',
        controllerAs: 'vm'
    })
    .state('admin.product', {
        url: '/product',
        templateUrl: 'app/admin/product.html',
        controller: 'AdminProductController',
        controllerAs: 'vm'
    })
    .state('admin.user', {
        url: '/product',
        templateUrl: 'app/admin/user.html'
    })
    .state('admin.setting', {
        url: '/product',
        templateUrl: 'app/admin/setting.html'
    })

    $locationProvider.html5Mode({
        enabled: true
    });
}

var check_logged = function(Logger,$q,$location){
	var deferred = $q.defer();
    if(Logger.user_details){
        if(Logger.user_details.role[0].type === 'admin'){
            console.log(Logger);
            deferred.resolve();
        
        }else{
            $location.url('/');
        }
    }else{
        $location.url('/');
    }
	
}