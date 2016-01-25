angular
	.module('app')
	.controller('PasswordController', PasswordController);

PasswordController.$inject = ['User','Logger'];

function PasswordController(User,Logger) {
	var vm = this;
	vm.password = null;
    vm.change_password = change_password;

    function change_password(password){
        if(angular.isUndefined(password) || password === null || !password.new || !password.confirm_new || !password.old){
            Materialize.toast('Something is missing', 2000);
            return;
        }
        if(password.new !== password.confirm_new){
            Materialize.toast('Confirm new password is not matched with new password', 2000);
            return;
        }
        if(password.new === password.old){
            Materialize.toast('Old password cannot match new passwors', 2000);
            return;
        }
        var data = {id : Logger.user_details._id, password: password, types:"password"}
        User.update({_id:data.id},data, function(res) {
            if(res.response === 'Old password mismatch'){
                Materialize.toast('Old password mismatch', 2000);
            }else if(res.response.updated.nModified === 1){
                vm.password = null;
                Logger.user_details = res.response.user;
                Materialize.toast('Successfully Changed Password', 2000);
            }
        });
    }
}