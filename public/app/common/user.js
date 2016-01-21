angular
	.module('app')
	.service('User', User);

User.$inject = ['$resource'];

function User($resource) {
	return $resource('/api/user/:page/:size/:type/:discount',null,{
		update: {
      		method: 'PUT'
    	},
    	delete: { 
    		method: 'DELETE', params: {id: 'id'} 
    	}
	});
}