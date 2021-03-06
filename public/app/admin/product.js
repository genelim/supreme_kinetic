angular
	.module('app')
	.controller('AdminProductController', AdminProductController);

AdminProductController.$inject = ['$http','$rootScope','users','$scope','File_Upload','$q','cfpLoadingBar','Product','Product_Category','Logger'];

function AdminProductController($http, $rootScope,users,$scope,File_Upload,$q,cfpLoadingBar,Product,Product_Category,Logger) {
	var vm = this;
	vm.add_product = add_product;
    vm.add_product_confirm = add_product_confirm;
	vm.new_color = new_color;
    vm.new_size = new_size;
    vm.new_image = new_image;
    vm.new_discount = new_discount;
	vm.product_save = product_save;
    vm.users = users;
    vm.categories = [];
    vm.products = [];
    vm.images_selected = [];
    vm.images_selected_uploaded = [];
    vm.colors = [{name: 'Color', children: []}];
	vm.images = [{name: 'Images', children: []}];
    vm.sizes = [{name: 'Size', children: []}];
	vm.discounts = [{name: 'Discount', children: []}];
    vm.category_type = 'outdoor';
    vm.image_remove = image_remove;
    vm.pagination_number = pagination_number;
    vm.next_user_page = next_user_page;
    vm.previous_user_page = previous_user_page;
    vm.static_user_page = static_user_page;
    vm.display_product = display_product;
    vm.product_load = product_load;
    vm.view_product = view_product;
    vm.edit_product_confirm = edit_product_confirm;
    vm.temp_product = [];
    vm.edit_add_color = edit_add_color;
    vm.edit_add_size = edit_add_size;
    vm.edit_add_image = edit_add_image;
    vm.edit_add_discount = edit_add_discount;
    vm.edit_image_remove = edit_image_remove;
    vm.edit_images_selected = [];
    vm.delete_product = delete_product;
    vm.selected_product = [];

    vm.number = 0;
    vm.current_page = 1;
    vm.size = 5;
    vm.count = 0;

    $scope.upload = function(element,a) {
        $scope.$apply(function () {
            vm.images[0].children[a].image_path = URL.createObjectURL(element.files[0])   
        });
        vm.images_selected.push(element.files[0]);
    };

	angular.element(document).ready(function () {
        $('ul.tabs').tabs();
        category_load('sub');
        product_load(vm.category_type);
        get_recommended_count();
        $rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];
        $rootScope.home_default = false;
    });

    function get_recommended_count(){
        $http.get('/api/product_recommended_count').success(function(count){
            vm.count = count.response;
        });
    }

    function category_load(type){
        vm.sub_category= type;
        cfpLoadingBar.start();
        Product_Category.get({type : vm.sub_category}, function(res){
            vm.categories = res.response;
            cfpLoadingBar.complete();
        });
    }

    function product_load(type){
        vm.category_type = type;
        vm.current_page = 1;
        cfpLoadingBar.start();
        Product.get({page : 1, size:vm.size, type : type, location:'admin'}, function(res){
            vm.products = res.response.product;
            vm.number = ( Math.ceil(res.response.count/vm.size));
            cfpLoadingBar.complete();
        });
    }

    function pagination_number(number){
        return new Array(number);
    }

    function next_user_page(){
        if(vm.current_page < vm.number){
            cfpLoadingBar.start();
            var page = vm.current_page + 1;
            Product.get({page : page, size:vm.size, type:vm.category_type, location:'admin'},function(res){
                vm.products = (res.response.product);
                vm.current_page = page;
                cfpLoadingBar.complete();
            });
        }
        
    }

    function previous_user_page(){
        if(vm.current_page > 1){
            cfpLoadingBar.start();
            var page = vm.current_page - 1;
            Product.get({page : page, size:vm.size, type:vm.category_type, location:'admin'},function(res){
                vm.products = (res.response.product);
                vm.current_page = page;
                cfpLoadingBar.complete();
            });
        }
    }

    function static_user_page(static){
        if(static === 0){
            var page = 1;
        }else if (static === 1){
            var page = vm.number;
        }
        cfpLoadingBar.start();
        Product.get({page : page, size:vm.size, type:vm.category_type, location:'admin'},function(res){
            vm.products = (res.response.product);
            vm.number = ( Math.ceil(res.response.count/vm.size));
            vm.current_page = page;
            cfpLoadingBar.complete();
        });
    }

    function display_product(page){
        vm.current_page = page;
        cfpLoadingBar.start();
        Product.get({page : page, size:vm.size, type:vm.category_type, location:'admin'},function(res){
            vm.products = (res.response.product);
            cfpLoadingBar.complete();
        });   
    }

    function add_product(){
    	$('#add_product').openModal();
    }

    function add_product_confirm(product){
        if( angular.isUndefined(product) || !product.name || !product.model || !product.sku || !product.brand || !product.price || !product.quantity || !product.category){
            Materialize.toast('Something is missing', 2000);
            return;
        }
        if(isNaN(product.price)){
            Materialize.toast('Price must be integer', 2000);
            return;
        }
        if(isNaN(product.quantity)){
            Materialize.toast('Quantity must be integer', 2000);
            return;
        }
        var uploadUrl = "/api/upload";
        var promises = [];
        angular.forEach(vm.images_selected, function(value){
            promises.push(File_Upload.uploadFileToUrl(value, uploadUrl)
                .success(function(result){
                    vm.images_selected_uploaded.push(result);
                })
            );
        });
        $q.all(promises).then(function () {
            vm.product_save(product,vm.images_selected_uploaded,vm.discounts,vm.colors,vm.sizes);
        });
    }

    function product_save(product_main,product_image,product_discount,product_color,product_size){
        if( angular.isUndefined(product_main) || !product_main.name || !product_main.model || !product_main.sku || !product_main.brand || !product_main.price || !product_main.category || !product_main.quantity){
            Materialize.toast('Something is missing', 2000);
            return;
        }
        if(!product_main.description){
            product_main.description = '';
        }
        if(isNaN(product_main.price)){
            Materialize.toast('Price must be integer', 2000);
            return;
        }
        if(isNaN(product_main.quantity)){
            Materialize.toast('Quantity must be integer', 2000);
            return;
        }
        var new_product = [{product_main:product_main,product_image:product_image,product_discount:product_discount,product_color:product_color,product_size:product_size,user:Logger.user_details,category_type:vm.category_type}];
        Product.save(new_product,function(res){
            static_user_page(1)
            vm.images_selected = [];
            vm.images_selected_uploaded = [];
            vm.colors = [{name: 'Color', children: []}];
            vm.images = [{name: 'Images', children: []}];
            vm.sizes = [{name: 'Size', children: []}];
            vm.discounts = [{name: 'Discount', children: []}];
            vm.product = null;
            $('#add_product').closeModal();
            Materialize.toast('New Product Added', 2000);
        })
    }

    function new_color(color, $event) {
        color.children.push({ name: '#26a69a' });
        $event.preventDefault();
    }   

    function new_size(size, $event) {
        size.children.push({ name: '' });
        $event.preventDefault();
    } 
    function discount_code(){
        var code = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for( var i=0; i < 5; i++ )
            code += possible.charAt(Math.floor(Math.random() * possible.length));
        return code;
    }

    function new_discount(discount, $event) {
        discount.children.push({date:new Date(),percentage:0,days:0,duration_type:'Day(s)',selected_user:'',discount_validate:false,discount_code:discount_code()});
        $event.preventDefault();
    }    

    function new_image(image, $event) {
        image.children.push({ image_path: ''});
        $event.preventDefault();
    }   

    function image_remove(image,$index){
        image.children.splice($index, 1);
        vm.images_selected.splice($index,1);
    }

    function view_product(product){
        vm.product_details = angular.copy(product);
        vm.product_details_image_copy = angular.copy(product.image);
        $('#edit_product').openModal();
        
    }

    function edit_product_confirm(product){
        var uploadUrl = "/api/upload";
        var promises = [];
        angular.forEach(vm.edit_images_selected, function(value){
            promises.push(File_Upload.uploadFileToUrl(value, uploadUrl)
                .success(function(result){
                    vm.images_selected_uploaded.push(result);
                })
            );
        });
        $q.all(promises).then(function () {
            var count = 0;
            for(var i = 0; i < vm.product_details.image.length; i++){
                if(vm.images_selected_uploaded.length < 1){
                }else if (vm.product_details.image[i].indexOf("/assets/images/upload/") > -1 ){
                }else if (typeof vm.product_details_image_copy[i] === 'undefined' || vm.product_details_image_copy[i] === null ||  vm.product_details_image_copy[i] === undefined || typeof vm.product_details_image_copy[i].indexOf("/assets/images/upload/")) {
                    vm.product_details_image_copy[i] = vm.images_selected_uploaded[count].path;
                    count++;
                }else if(vm.edit_images_selected[i] !== vm.product_details_image_copy[i]){
                    vm.product_details_image_copy[i] = vm.images_selected_uploaded[count].path;
                    count++;
                }
            }
            vm.product_details.image = vm.product_details_image_copy;
            vm.product_details.updated = {date:new Date(), user:Logger.user_details._id};
            if(vm.count > 2){
                if(vm.product_details.recommended === true){
                    Materialize.toast('You can only have 3 recommended products', 2000);
                    return;   
                }
            }
            Product.update({_id:vm.product_details._id},vm.product_details, function(res) {
                console.log(res.response)
                if(res.response.product.nModified === 1){
                    vm.product_details = [];
                    vm.edit_images_selected = [];
                    vm.product_details_image_copy = [];
                    vm.images_selected_uploaded = [];
                    display_product(vm.current_page);
                    $('#edit_product').closeModal();
                }
                vm.count = res.response.count;
            });
        });
    }

    function edit_add_color(color, $event) {
        color.push('#26a69a');
        $event.preventDefault();
    } 

    function edit_add_size(size, $event) {
        size.push('');
        $event.preventDefault();
    }   

    function edit_add_image(image, $event) {
        image.push('');
        $event.preventDefault();
    } 

    function edit_add_discount(discount, $event) {
        discount.push({date:new Date(),percentage:0,days:0,duration_type:'Day(s)',selected_user:'',discount_validate:false,discount_code:discount_code()});
        $event.preventDefault();
    }   

    $scope.edit_upload = function(element,a) {
        $scope.$apply(function () {
            vm.product_details.image[a] = URL.createObjectURL(element.files[0])   
        });
        vm.edit_images_selected.push(element.files[0]);
    };

    function delete_product() {
        vm.selected_product = [];
        for(var i = 0; i < vm.products.length; i++){
            if(vm.products[i].selected){
                vm.selected_product.push(vm.products[i]._id);
            }
        }
        var params = {id: vm.selected_product};
        Product.delete(params,function(res){
            if(res.response.ok === 1){
                product_load(vm.category_type)
            }
        },function(){
            alert('Server Error, Contact Developer')
        });
    }   

    function edit_image_remove(image,index) {
        vm.product_details.image.splice(index, 1);
        vm.product_details_image_copy = vm.product_details.image;
    }  
}

//angular copy WOW!



