angular
	.module('app')
	.service('Product_Category', Product_Category);

Product_Category.$inject = ['$resource'];

function Product_Category($resource) {
	return $resource('/api/product_category/:type/:id', {}, {
		delete: { method: 'DELETE', params: {id: 'id'} }
	});
}