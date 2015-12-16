angular
	.module('app')
	.controller('AdminProductController', AdminProductController);

AdminProductController.$inject = ['$rootScope','users','$scope','File_Upload','$q'];

function AdminProductController($rootScope,users,$scope,File_Upload,$q) {
	var vm = this;
	vm.add_product = add_product;
    vm.add_product_confirm = add_product_confirm;
	vm.new_color = new_color;
    vm.new_size = new_size;
    vm.new_image = new_image;
    vm.new_discount = new_discount;
	vm.product_save = product_save;
    vm.users = users;
    vm.images_selected = [];
    vm.images_selected_uploaded = [];
    vm.colors = [{name: 'Color', children: []}];
	vm.images = [{name: 'Images', children: []}];
    vm.sizes = [{name: 'Size', children: []}];
	vm.discounts = [{name: 'Discount', children: []}];

    $scope.upload = function(element,a) {
        $scope.$apply(function () {
            vm.images[0].children[a].image_path = URL.createObjectURL(element.files[0])   
        });
        vm.images_selected.push(element.files[0]);
    };

	angular.element(document).ready(function () {
        $('ul.tabs').tabs();
    });

    function add_product(){
    	$('#add_product').openModal();
    }

    function add_product_confirm(product){
        var uploadUrl = "/api/upload";
        $('#add_product').closeModal();
        var promises = [];
        angular.forEach(vm.images_selected, function(value , key){
            promises.push(File_Upload.uploadFileToUrl(value, uploadUrl)
                .success(function(result){
                    vm.images_selected_uploaded.push(result);
                })
            );
        })
        $q.all(promises).then(function () {
            console.log(vm.images_selected_uploaded)
            vm.product_save(product,vm.images_selected_uploaded,vm.discounts,vm.colors,vm.sizes);
        });
    }

    function product_save(product_main,product_image,product_discount,product_color,product_size){
        console.log(product_main,product_image,product_discount,product_color,product_size)
    }

    function new_color(color, $event) {
        color.children.push({ name: '#26a69a' });
        $event.preventDefault();
    }   

    function new_size(size, $event) {
        size.children.push({ name: '' });
        $event.preventDefault();
    } 

    function new_discount(discount, $event) {
        discount.children.push({date:'',percentage:0,days:0,duration_type:'Day(s)',selected_user:'',discount_validate:false});
        $event.preventDefault();
    }    

    function new_image(image, $event) {
        image.children.push({ image_path: ''});
        $event.preventDefault();
    }   
}