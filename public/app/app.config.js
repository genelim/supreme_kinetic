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
            controllerAs: 'vm'
        })
        .otherwise({redirectTo:'/'});
}