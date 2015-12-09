angular
	.module('app')
	.controller('AdminProductController', AdminProductController);

AdminProductController.$inject = ['$rootScope','users','$scope','File_Upload'];

function AdminProductController($rootScope,users,$scope,File_Upload) {
	var vm = this;
	vm.add_product = add_product;
    vm.add_product_confirm = add_product_confirm;
	vm.new_color = new_color;
    vm.new_size = new_size;
    vm.new_image = new_image;
	vm.new_discount = new_discount;
    vm.users = users;
    vm.colors = [{name: 'Color', children: []}]
	vm.images = [{name: 'Images', children: []}]
    vm.sizes = [{name: 'Size', children: []}]
	vm.discounts = [{name: 'Discount', children: []}]

	$rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Home',path:''}];
	$rootScope.home_default = false;

    $scope.upload = function(element,a) {
        var uploadUrl = "/api/upload";
        vm.images[0].children[a].image_path = URL.createObjectURL(element.files[0])
        File_Upload.uploadFileToUrl(element.files[0], uploadUrl)
        .success(function(result){
            console.log(result)
        });
    };

	angular.element(document).ready(function () {
        $('ul.tabs').tabs();
    });

    function add_product(){
    	$('#add_product').openModal();
    }

    function add_product_confirm(product){
        $('#add_product').closeModal();
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