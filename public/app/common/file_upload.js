angular
	.module('app')
	.service('File_Upload', File_Upload);

File_Upload.$inject = ['$http'];

function File_Upload($http) {
	this.uploadFileToUrl = uploadFileToUrl

    function uploadFileToUrl(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        var uploaded = $http
        .post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        return uploaded;
    }
}