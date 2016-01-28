angular
	.module('app')
	.service('Transaction', Transaction);

Transaction.$inject = ['$resource'];

function Transaction($resource) {
	return $resource('/api/transaction/:id',null,{
		update: {
      		method: 'PUT'
    	},
    	delete: { 
    		method: 'DELETE', params: {id: 'id'} 
    	}
	});
}