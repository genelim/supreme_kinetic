'use strict'

angular
    .module('app')
    .controller('HomeController', HomeController);

HomeController.$inject = ['$rootScope','$scope'];

function HomeController($rootScope,$scope) { 
	var vm = this;
    vm.title = "Supreme Kinetic";
    $rootScope.home_default = true;
    vm.tab_menu = 	[
					    {name:'Fan',disabled:'',active:'',id:'fan', icon:'event_seat'},
					    {name:'Electric Kettle',disabled:'',active:'active',id:'electric_kettle',icon:'opacity'},
					    {name:'Cutleries',disabled:'',active:'',id:'cutleries', icon:'card_travel'},
					    {name:'Reward',disabled:'disabled',active:'',id:'reward', icon:'redeem'}
				   	];
                    
    angular.element(document).ready(function () {
        $('ul.tabs').tabs();
    });
}