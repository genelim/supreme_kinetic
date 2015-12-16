angular
	.module('app')
	.service('Product', Product);

Product.$inject = ['$resource'];

function Product($resource) {
	return $resource('/api/product');
}