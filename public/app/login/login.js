angular
    .module('app')
    .controller('LoginController', LoginController);

LoginController.$inject = ['Transaction','User','Logger','$localStorage','$scope','$rootScope','$location','Facebook'];

function LoginController(Transaction,User,Logger,$localStorage,$scope,$rootScope,$location,Facebook) { 
    var vm = this;
    vm.fb_login = fb_login;
    vm.user_modal = user_modal;
    vm.user_modal_press = user_modal_press;
    vm.logout = logout;

    $scope.$on('$stateChangeStart', function(){
        if(Logger.is_logged){
            vm.username = Logger.user_details.first_name + ' ' + Logger.user_details.last_name;
            if(Logger.user_details.profile_image){
                vm.profile_image = Logger.user_details.profile_image;
            }else{
                vm.profile_image = '/assets/images/default_user.png';
            }
            check_admin();
        }
    });

    function check_admin(){
        if(Logger.user_details.role[0].type === "admin" && typeof Logger.user_details.role[0].type !== 'undefined'){
            $rootScope.user_menu = [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'},{name:'Admin',path:'admin/dashboard'}];
        }else{
            $rootScope.user_menu =  [{name:'Profile',path:'profile'},{name:'Setting',path:'setting'}];
        }
    }

    function user_modal(type){
        $('#user_open').openModal({
            ready: function(){
                $('ul.tabs').tabs('select_tab', type);
            }
        });
    }   

    function user_modal_press(value,type){
        if(type === 'local'){
            if( angular.isUndefined(value) || !value.first_name || !value.last_name || !value.email || !value.password || !value.confirm_password){
                Materialize.toast('Something is missing', 2000);
                return;
            }else if(value.password !== value.confirm_password){
                Materialize.toast('Confirm password is not matched with password', 2000);
                return;
            }
        }else if(type === "login"){
            if( angular.isUndefined(value) || !value.email || !value.password){
                Materialize.toast('Something is missing', 2000);
                return;
            }
        }
        value.type = type;
        value.role = {type:"member",level:0}
        User.save(value, function(res){
            if(res.response !== 'User Existed' && res.response !== 'Invalid Username or Password' && res.response !== 'Server Error'){
                Logger.is_logged = true;
                Logger.user_details = res.response;
                $localStorage.user_details = res.response;
                vm.username = res.response.first_name + ' ' + res.response.last_name;
                if(res.response.profile_image){
                    vm.profile_image = res.response.profile_image;
                }else{
                    vm.profile_image = '/assets/images/default_user.png';
                }
                check_admin();
                if(type === "login"){
                    vm.local_login.email = null;
                    vm.local_login.password = null;
                    vm.local_login.checkbox = null;
                    vm.local_login.type = null;
                }else if(type === "local"){
                    vm.registering.first_name = null;
                    vm.registering.last_name = null;
                    vm.registering.email = null;
                    vm.registering.password = null;
                    vm.registering.confirm_password = null;
                    vm.registering.type = null;
                }
                Transaction.get({id:res.response._id},function(res){
                    if(res.response === 'Server Error'){
                        Materialize.toast('Please refresh the page and try again', 2000);
                    }else if(res.response == 0){
                        $rootScope.cart_quantity = 0;
                    }else{
                        $rootScope.cart_quantity = res.response.product.length;
                    }
                })
                $('#user_open').closeModal();
            }else{
                Materialize.toast(res.response, 2000);
            }
        }, function(error) {
                Materialize.toast(error.statusText, 2000);
        });
    }

    function logout(){
        Logger.is_logged = false;
        $localStorage.$reset();
        Logger.user_details = null;
        vm.username = null;
        vm.profile_image = null;
        $rootScope.cart_quantity = 0;
        $location.url('/');
    }

    function fb_login(){
        var details = [];
        Facebook.login() 
            .then(function(response) {
                details = {response: response, type: 'facebook', role: {type:"member",level:0}};
                User.save(details, function(res){
                    if(res.response !== 'Server Error'){
                        Logger.is_logged = true;
                        Logger.user_details = res.response;
                        $localStorage.user_details = res.response;
                        vm.username = res.response.first_name + ' ' + res.response.last_name;
                        vm.profile_image = res.response.profile_image;
                        check_admin();
                        details = [];
                        Transaction.get({id:res.response._id},function(res){
                            if(res.response === 'Server Error'){
                                Materialize.toast('Please refresh the page and try again', 2000);
                            }else if(res.response == 0){
                                $rootScope.cart_quantity = 0;
                            }else{
                                $rootScope.cart_quantity = res.response.product.length;
                            }
                        })
                    }else{
                        Materialize.toast(res.response, 2000);
                    }
                    $('#user_open').closeModal();
                }, function(error) {
                    Materialize.toast(error.statusText, 2000);
                });
            }
        );
    }
}