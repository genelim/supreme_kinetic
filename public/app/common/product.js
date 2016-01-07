angular
	.module('app')
	.service('Product', Product);

Product.$inject = ['$resource'];

function Product($resource) {
	return $resource('/api/product/:page/:size/:type/:location',null,{
		update: {
      		method: 'PUT'
    	}
	});
}