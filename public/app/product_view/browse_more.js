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

BrowseMoreController.$inject = ['$stateParams','Product','cfpLoadingBar','$http','Product_Brand','Product_Category'];

function BrowseMoreController($stateParams, Product, cfpLoadingBar, $http,Product_Brand,Product_Category) {
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
	vm.size = 8;
    vm.sort_brand = sort_brand;
    vm.sort_price = sort_price;
	vm.products = null;
    vm.product_details = null;
    vm.static_user_page = static_user_page;
    vm.pagination_number = pagination_number;
    vm.next_user_page = next_user_page;
    vm.previous_user_page = previous_user_page;
	vm.display_product = display_product;
    vm.category_check = 'main';
    vm.price_low = 0;
    vm.price_high = 0;

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
            });
        }
    }

    function view_details(product){
    	vm.product_details = product;
    	$('#browse_more_view').openModal();
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
}