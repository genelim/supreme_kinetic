angular
    .module('app')
    .factory('Facebook', Facebook);
    
Facebook.$inject = ['$q'];

function Facebook($q) { 
	return {
        login: function() {
            var deferred = $q.defer();
            
            var promise = facebook_me();
            var login = facebook_login();

            promise.then(function(res) {
				deferred.resolve(res);
			}, function(res) {
			  	login.then(function(res) {
			  		FB.api('/me', 
			  			{fields: 'first_name,last_name,email,picture'},
						function(response) {
							if (!response || response.error) {
					        	deferred.reject('Error Occured!');
					        } else {
					            deferred.resolve(response);
					        }
				    });
				}, function(res) {
				  	alert(res);
				});
			});
			            
            return deferred.promise;
        }
    }

    function facebook_me() {
		var deferred = $q.defer();
		FB.api('/me', 
			{fields: 'first_name,last_name,email,picture'},
			function(response) {
				if (!response || response.error) {
		        	deferred.reject('Error Occured!');
		        } else {
		            deferred.resolve(response);
		        }
	    });
		return deferred.promise;
	}

	function facebook_login() {
		var deferred = $q.defer();
		FB.login(function(response) {
			if (response.status === 'connected') {
				deferred.resolve(response);
			} else if (response.status === 'not_authorized') {
				deferred.reject('To logged into tis app, you will need to authorized it. Login to autorized it.');
			} else {
				deferred.reject('You are not logged into Facebook');
			}
		},{scope: 'email'});
		return deferred.promise;
	}
}