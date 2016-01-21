angular
    .module('app')
    .config(config);

config.$inject = ['$urlRouterProvider','$stateProvider','$locationProvider','cfpLoadingBarProvider'];

function config($urlRouterProvider,$stateProvider,$locationProvider,cfpLoadingBarProvider) {
    $urlRouterProvider.otherwise('/404');
    $urlRouterProvider.when('/admin', '/admin/dashboard');
    $urlRouterProvider.when('/admin/', '/admin/dashboard');
    $urlRouterProvider.when('/profile', '/profile/information');
    $urlRouterProvider.when('/profile/', '/profile/information');

    $stateProvider
    .state('home', {
        url:'/',
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
    })
    .state('404', {
        url:'/404',
        templateUrl: 'app/error/404.html',
        controller: '404Controller',
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
        controllerAs: 'vm',
        resolve: {users: get_discount_user}
    })
    .state('admin.user', {
        url: '/user',
        templateUrl: 'app/admin/user.html',
        controller: 'AdminUserController',
        controllerAs: 'vm'
    })
    .state('admin.setting', {
        url: '/setting',
        templateUrl: 'app/admin/setting.html',
        controller: 'AdminSettingController',
        controllerAs: 'vm'
    })
    .state('browse_more', {
        url: '/browse_more/:category',
        templateUrl: 'app/product_view/browse_more.html',
        controller: 'BrowseMoreController',
        controllerAs: 'vm'
    })
    .state('profile', {
        url: '/profile',
        templateUrl: 'app/user/profile.html',
        controller: 'ProfileSettingController',
        controllerAs: 'vm'
    }).state('profile.information', {
        url: '/information',
        templateUrl: 'app/user/information.html'
    }).state('profile.password', {
        url: '/password',
        templateUrl: 'app/user/password.html',
        controller: 'PasswordController',
        controllerAs: 'vm'
    }).state('profile.address', {
        url: '/address',
        templateUrl: 'app/user/address.html'
    }).state('profile.wishlist', {
        url: '/wishlist',
        templateUrl: 'app/user/wishlist.html'
    }).state('profile.order_history', {
        url: '/order_history',
        templateUrl: 'app/user/order_history.html'
    });

    $locationProvider.html5Mode({
        enabled: true
    });

    cfpLoadingBarProvider.includeSpinner = false;
}

var check_logged = function(Logger,$q,$location,$rootScope){
	var deferred = $q.defer();
    if(Logger.user_details){
        if(Logger.user_details.role[0].type === 'admin'){
            deferred.resolve();        
        }else{
            $location.url('/');
        }
    }else{
        $location.url('/');
    }	
}

var get_discount_user = function(User,$q){
    var deferred = $q.defer();
    User.get({discount:'discount'},function(successData) {
        deferred.resolve(successData); 
    }, function(errorData) {
        deferred.reject(); 
    });
    return deferred.promise;
}