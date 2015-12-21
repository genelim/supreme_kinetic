angular
    .module('app')
    .controller('LoginController', LoginController);

LoginController.$inject = ['User','Logger','$localStorage','$scope','$rootScope','$location','Facebook'];

function LoginController(User,Logger,$localStorage,$scope,$rootScope,$location,Facebook) { 
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
                alert('something is missing');
                return;
            }else if(value.password !== value.confirm_password){
                alert('confirm password is not matched with password');
                return;
            }
        }else if(type === "login"){
            if( angular.isUndefined(value) || !value.email || !value.password){
                alert('something is missing');
                return;
            }
        }
        value.type = type;
        value.role = {type:"member",level:0};
        User.save(value, function(res){
            console.log(res);
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
                $('#user_open').closeModal();
            }else{
                alert(res.response);
            }
        }, function(error) {
            alert(error.statusText);
        });
    }

    function logout(){
        Logger.is_logged = false;
        $localStorage.$reset();
        vm.username = null;
        vm.profile_image = null;
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
                    }else{
                        alert(res.response);
                    }
                    $('#user_open').closeModal();
                }, function(error) {
                    alert(error.statusText);
                });
            }
        );
    }
}