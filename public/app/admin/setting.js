angular
	.module('app')
	.controller('AdminSettingController', AdminSettingController);

AdminSettingController.$inject = ['Product_Category','cfpLoadingBar','$rootScope','Logger'];

function AdminSettingController(Product_Category,cfpLoadingBar,$rootScope,Logger) {
	var vm = this;
	vm.categories = [];
	vm.category_type = null;
	vm.new_category = new_category;
	vm.add_category = add_category;
	vm.change_category = change_category;
	vm.delete_category = delete_category;

	angular.element(document).ready(function () {
        $('ul.tabs').tabs();
        category_load('sub');
        $rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];
        $rootScope.home_default = false;
    });

    function category_load(type){
    	vm.category_type = type;
        cfpLoadingBar.start();
    	Product_Category.get({type : vm.category_type}, function(res){
			vm.categories = res.response;
        	cfpLoadingBar.complete();
		});
    }

    function change_category(type){
    	category_load(type);
    }

    function new_category(type){
    	$('#category').openModal();
    	vm.category_type = type;
    }

    function delete_category(category){
    	var params = {id: category._id};
		Product_Category.delete(params,function(res){
			if(res.response.ok === 1){
				category_load(vm.category_type)
			}
		},function(){
        	alert('Server Error, Contact Developer')
    	});
    }

    function add_category(value){
    	if(vm.category_type === 'sub'){
    		 if( angular.isUndefined(value) || !value.name){
    		 	alert('category is missing');
            }else{
            	var data = [{category:value,type:vm.category_type,user:Logger.user_details._id}];
    			Product_Category.save(data, function(result){
    				if(result.response !== 'Category Existed'){
    					vm.categories.push(result.response);
	 					vm.category.name = null;
    					$('#category').closeModal();
    				}else{
    					alert(result.response);
    				}
    			})
            }
    	}
    }
}