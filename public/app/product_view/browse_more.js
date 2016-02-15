angular
	.module('app')
	.controller('BrowseMoreController', BrowseMoreController)
    .filter('unique', function() {
       return function(collection, keyname) {
          var output = [], 
              keys = [];

          angular.forEach(collection, function(item) {
              var key = item[keyname];
              if(keys.indexOf(key) === -1) {
                  keys.push(key);
                  output.push(item);
              }
          });

          return output;
       };
    });

BrowseMoreController.$inject = ['Transaction','Logger','$rootScope','$stateParams','Product','cfpLoadingBar','$http','Product_Brand','Product_Category'];

function BrowseMoreController(Transaction, Logger, $rootScope, $stateParams, Product, cfpLoadingBar, $http,Product_Brand,Product_Category) {
	var vm = this;
	vm.get_products = get_products;
    vm.view_details = view_details;
    vm.category_load = category_load;
    vm.sort_category = sort_category;
	vm.brand_load = brand_load;
    vm.selected_category = [];
    vm.selected_brand= [];
    vm.number = 0;
    vm.current_page = 1;
	vm.size = 9;
    vm.sort_brand = sort_brand;
    vm.sort_price = sort_price;
	vm.products = null;
    vm.product_details = null;
    vm.static_user_page = static_user_page;
    vm.pagination_number = pagination_number;
    vm.next_user_page = next_user_page;
    vm.previous_user_page = previous_user_page;
    vm.display_product = display_product;
	vm.add_to_cart = add_to_cart;
    vm.category_check = 'main';
    vm.price_low = 0;
    vm.price_high = 0;
    vm.selected_image = null;
    vm.select_image = select_image;
    vm.done = 0;
    vm.product = {select_quantity:1};
    vm.color = null;
    vm.size_product = null;
    vm.type_select = type_select;

	angular.element(document).ready(function () {
        $('.collapsible').collapsible({
      		accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    	});
    	vm.get_products();
        vm.category_load($stateParams.category);
        vm.brand_load($stateParams.category);
    });

    function get_products(){
        vm.current_page = 1;
        cfpLoadingBar.start();
        if(vm.category_check === 'main'){
        	Product.get({page : 1, size:vm.size, type:$stateParams.category, location:'admin'},function(res){
                vm.number = ( Math.ceil(res.response.count/vm.size));
                vm.products = (res.response.product);
                cfpLoadingBar.complete();
                vm.done = 1;
            });
        }
    }

    function view_details(product){
    	vm.product_details = product;
    	$('#browse_more_view').openModal();
        vm.selected_image = vm.product_details.image[0];
                console.log(vm.product_details)
    }

    function category_load(type){
        vm.sub_category= type;
        cfpLoadingBar.start();
        Product_Category.get({type : vm.sub_category}, function(res){
            vm.categories = res.response;
            cfpLoadingBar.complete();
        });
    }

    function brand_load(type){
        vm.sub_category= type;
        cfpLoadingBar.start();
        Product_Brand.get({type : vm.sub_category}, function(res){
            vm.brands = res.response;
            cfpLoadingBar.complete();
        });
    }

    function sort_price(price){
        if( angular.isUndefined(price)){
            Materialize.toast('Something is still missing', 2000);
            return;
        }
        if(!price.low && price.high){
            price.low = 0;
        }
        if(price.low && !price.high){
            price.high = 999999999;
        }
        vm.price_low =price.low;
        vm.price_high = price.high;
        vm.current_page = 1;
        cfpLoadingBar.start();
        $http.get('/api/sort_price', { params:{page : vm.current_page, size:vm.size, low: price.low, high:price.high, category: $stateParams.category}}).success(function(product){
            vm.products = product.response.product;
            vm.number = ( Math.ceil(product.response.count/vm.size));
            vm.price = null;
            cfpLoadingBar.complete();
            vm.category_check = 'price';
        })
    }

    function sort_category(){
        vm.current_page = 1;
        vm.selected_category = [];
        for(var i = 0; i < vm.categories.length; i++){
            if(vm.categories[i].selected){
                vm.selected_category.push(vm.categories[i].sub_category);
            }
        }
        $http.get('/api/sort_category', { params:{page : vm.current_page, size:vm.size,sub_category:vm.selected_category, category: $stateParams.category}}).success(function(product){
            vm.products = product.response.product;
            console.log(product.response.product);
            vm.number = ( Math.ceil(product.response.count/vm.size));
            cfpLoadingBar.complete();
            vm.category_check = 'category';
        });
    }

    function sort_brand(){
        vm.selected_brand = [];
        vm.current_page = 1;

        cfpLoadingBar.start();
        for(var i = 0; i < vm.brands.length; i++){
            if(vm.brands[i].selected){
                vm.selected_brand.push(vm.brands[i].brand);
            }
        }
        $http.get('/api/sort_brand', { params:{page : vm.current_page, size:vm.size,brand:vm.selected_brand, category: $stateParams.category}}).success(function(product){
            vm.products = product.response.product;
            console.log(product.response.product)
            vm.number = ( Math.ceil(product.response.count/vm.size));
            cfpLoadingBar.complete();
            vm.category_check = 'brand';
        });
    }

    function static_user_page(static){
        if(static === 0){
            var page = 1;
        }else if (static === 1){
            var page = vm.number;
        }
        cfpLoadingBar.start();
        if(vm.category_check === 'main'){
            Product.get({page : page, size:vm.size, type:$stateParams.category, location:'admin'},function(res){
                vm.products = (res.response.product);
                vm.current_page = page;
                cfpLoadingBar.complete();
            });
        } else if(vm.category_check === 'price'){
            $http.get('/api/sort_price', { params:{page : page, size:vm.size, low: vm.price_low, high:vm.price_high, category: $stateParams.category}}).success(function(product){
                vm.products = product.response.product;
                vm.current_page = page;
                cfpLoadingBar.complete();
            })
        } else if(vm.category_check === 'brand'){
            $http.get('/api/sort_brand', { params:{page : page, size:vm.size,brand:vm.selected_brand, category: $stateParams.category}}).success(function(product){
                vm.products = product.response.product;
                vm.current_page = page;
                cfpLoadingBar.complete();
            });
        } else if(vm.category_check === 'category'){
            $http.get('/api/sort_category', { params:{page : page, size:vm.size,sub_category:vm.selected_category, category: $stateParams.category}}).success(function(product){
                vm.products = product.response.product;
                vm.current_page = page;
                cfpLoadingBar.complete();
            });
        } 
    }

    function pagination_number(number){
        return new Array(number);
    }

    function next_user_page(){
        if(vm.current_page < vm.number){
            cfpLoadingBar.start();
            var page = vm.current_page + 1;
            if(vm.category_check === 'main'){
                Product.get({page : page, size:vm.size, type:$stateParams.category, location:'admin'},function(res){
                    vm.products = (res.response.product);
                    vm.current_page = page;
                    cfpLoadingBar.complete();
                });
            }else if(vm.category_check === 'price'){
                $http.get('/api/sort_price', { params:{page : page, size:vm.size, low: vm.price_low, high:vm.price_high, category: $stateParams.category}}).success(function(product){
                    vm.products = product.response.product;
                    vm.current_page = page;
                    cfpLoadingBar.complete();
                })
            }else if(vm.category_check === 'brand'){
                $http.get('/api/sort_brand', { params:{page : page, size:vm.size,brand:vm.selected_brand, category: $stateParams.category}}).success(function(product){
                    vm.products = product.response.product;
                    vm.current_page = page
                    cfpLoadingBar.complete();
                });
            } else if(vm.category_check === 'category'){
                $http.get('/api/sort_category', { params:{page : page, size:vm.size,sub_category:vm.selected_category, category: $stateParams.category}}).success(function(product){
                    vm.products = product.response.product;
                    vm.current_page = page;
                    cfpLoadingBar.complete();
                });
            } 
        } 
        
    }

    function previous_user_page(){
        if(vm.current_page > 1){
            cfpLoadingBar.start();
            var page = vm.current_page - 1;
            if(vm.category_check === 'main'){
                Product.get({page : page, size:vm.size, type:$stateParams.category, location:'admin'},function(res){
                    vm.products = (res.response.product);
                    vm.current_page = page;
                    cfpLoadingBar.complete();
                });
            }else if(vm.category_check === 'price'){
                $http.get('/api/sort_price', { params:{page : page, size:vm.size, low: vm.price_low, high:vm.price_high, category: $stateParams.category}}).success(function(product){
                    vm.products = product.response.product;
                    vm.current_page = page
                    cfpLoadingBar.complete();
                })
            }  else if(vm.category_check === 'brand'){
                $http.get('/api/sort_brand', { params:{page : page, size:vm.size,brand:vm.selected_brand, category: $stateParams.category}}).success(function(product){
                    vm.products = product.response.product;
                    vm.current_page = page
                    cfpLoadingBar.complete();
                });
            }  else if(vm.category_check === 'category'){
                $http.get('/api/sort_category', { params:{page : page, size:vm.size,sub_category:vm.selected_category, category: $stateParams.category}}).success(function(product){
                    vm.products = product.response.product;
                    vm.current_page = page;
                    cfpLoadingBar.complete();
                });
            } 
        }      
    }

    function display_product(page){
        vm.current_page = page;
        cfpLoadingBar.start();
        if(vm.category_check === 'main'){
            Product.get({page : page, size:vm.size, type:$stateParams.category, location:'admin'},function(res){
                vm.products = (res.response.product);
                cfpLoadingBar.complete();
            });   
        }else if(vm.category_check === 'price'){
            $http.get('/api/sort_price', { params:{page : page, size:vm.size, low: vm.price_low, high:vm.price_high, category: $stateParams.category}}).success(function(product){
                vm.products = product.response.product;
                vm.current_page = page
                cfpLoadingBar.complete();
            })
        }   else if(vm.category_check === 'brand'){
            $http.get('/api/sort_brand', { params:{page : page, size:vm.size,brand:vm.selected_brand, category: $stateParams.category}}).success(function(product){
                vm.products = product.response.product;
                vm.current_page = page
                cfpLoadingBar.complete();
            });
        } else if(vm.category_check === 'category'){
            $http.get('/api/sort_category', { params:{page : page, size:vm.size,sub_category:vm.selected_category, category: $stateParams.category}}).success(function(product){
                vm.products = product.response.product;
                vm.current_page = page;
                cfpLoadingBar.complete();
            });
        } 
    }

    function add_to_cart(product,quantity){
        if(angular.isUndefined(quantity) || quantity === null || quantity === ''){
            Materialize.toast('Please fill in quantity to add', 2000);
            return;
        }
        if(isNaN(quantity)){
            Materialize.toast('Quantity must only be number', 2000);
            return;
        }
        if(vm.color === null){
            if(product.color.length > 0){
                Materialize.toast('Please select color', 2000);
                return;
            }else{
                vm.color = null;
            }   
        }
        if(vm.size_product === null){
            if(product.size.length > 0){
                Materialize.toast('Please select size', 2000);
                return;
            }else{
                vm.size = null;
            } 
        }
        if(Logger.is_logged){
            var data = {user:Logger.user_details,product:product,quantity:quantity,color:vm.color,size:vm.size_product};
            Transaction.save(data, function(result){
                Materialize.toast('Added to Cart', 2000);
                Transaction.get({id:Logger.user_details._id},function(res){
                    if(res.response === 'Server Error'){
                        Materialize.toast('Please refresh the page and try again', 2000);
                    }else if(res.response == 0){
                        $rootScope.cart_quantity = 0;
                    }else{
                        var count = 0;
                        angular.forEach(res.response.product, function(item) {
                            if(item.product_id.length){
                                count += 1;
                            }
                        })
                        $rootScope.cart_quantity = count;
                    }
                })
                vm.color =null;
                vm.size_product =null;
                vm.product = {select_quantity:1};
            })
        }else{
            Materialize.toast('You are not logged in', 2000);
            vm.color =null;
            vm.size_product =null;
        }
        
    }
    function select_image(image){
        vm.selected_image = image;
    }

    function type_select(type,data){
        if(type === 'color'){
            vm.color = data;
        }else if(type === 'size'){
            vm.size_product = data;
        }
    }
}