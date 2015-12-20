angular
	.module('app')
	.controller('AdminProductController', AdminProductController);

AdminProductController.$inject = ['$rootScope','users','$scope','File_Upload','$q','cfpLoadingBar','Product','Product_Category','Logger'];

function AdminProductController($rootScope,users,$scope,File_Upload,$q,cfpLoadingBar,Product,Product_Category,Logger) {
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
    vm.image_remove = image_remove

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
        $rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];
        $rootScope.home_default = false;
    });

    function category_load(type){
        vm.sub_category= type;
        cfpLoadingBar.start();
        Product_Category.get({type : vm.sub_category}, function(res){
            vm.categories = res.response;
            cfpLoadingBar.complete();
        });
    }

    function product_load(type){
        vm.category_type= type;
        cfpLoadingBar.start();
        Product.get(function(res){
            vm.products = res.response;
            console.log(vm.products);
            cfpLoadingBar.complete();
        });
    }

    function add_product(){
    	$('#add_product').openModal();
    }

    function add_product_confirm(product){
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
            alert('something is missing');
            return;
        }
        if(!product_main.description){
            product_main.description = '';
        }
        if(isNaN(product_main.price)){
            alert('Price must be integer');
            return;
        }
        if(isNaN(product_main.quantity)){
            alert('Quantity must be integer');
            return;
        }
        var new_product = [{product_main:product_main,product_image:product_image,product_discount:product_discount,product_color:product_color,product_size:product_size,user:Logger.user_details._id,category_type:vm.category_type}];
        console.log(new_product)
        Product.save(new_product,function(res){
            product_load(vm.category_type);
            $('#add_product').closeModal();
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
}