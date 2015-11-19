angular
    .module('app')
    .controller('HomeController', HomeController);

function HomeController() { 
	var vm = this;
    vm.title = "Supreme Kinetic";
    vm.tab_menu = 	[
					    {name:'Chair',disabled:'',active:'',id:'chair', icon:'event_seat'},
					    {name:'Electric Kettle',disabled:'',active:'active',id:'electric_kettle',icon:'opacity'},
					    {name:'Cutleries',disabled:'',active:'',id:'cutleries', icon:'card_travel'},
					    {name:'Reward',disabled:'disabled',active:'',id:'reward', icon:'redeem'}
				   	];
    
    angular.element(document).ready(function () {
        $('ul.tabs').tabs();
    });
}