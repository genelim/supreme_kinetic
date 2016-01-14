angular
	.module('app')
	.service('Product_Brand', Product_Brand);

Product_Brand.$inject = ['$resource'];

function Product_Brand($resource) {
	return $resource('/api/product_brand/:type/:id', {}, {
		delete: { method: 'DELETE', params: {id: 'id'} }
	});
}