angular
	.module('app')
	.service('User', function($resource) {
  		return $resource('/api/user/:id');
	});