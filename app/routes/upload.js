var formidable = require('formidable');
var path = require('path');
var fs = require('fs');

exports.image = function (req, res) {
    console.log('in')
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        var file = files.file;
        var tempPath = file.path;
        var targetPath = path.resolve('./public/assets/images/upload/' + file.name);
        fs.rename(tempPath, targetPath, function (err) {
            if (err) {
                return res.json(err)
            }
            return res.json({path: '/assets/images/upload/' + file.name})
        })
    });
};