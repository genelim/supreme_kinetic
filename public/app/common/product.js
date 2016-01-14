angular
	.module('app')
	.service('Product', Product);

Product.$inject = ['$resource'];

function Product($resource) {
	return $resource('/api/product/:page/:size/:type/:location/:id',null,{
		update: {
      		method: 'PUT'
    	},
    	delete: { 
    		method: 'DELETE', params: {id: 'id'} 
    	}
	});
}