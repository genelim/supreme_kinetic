var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/supreme_kinetic'),
    User_Role = require('../models/user_role.js')(db),
    Address = require('../models/address.js')(db),
    User = require('../models/user.js')(db),
    bcrypt = require('bcrypt-nodejs');

var error_return = [{response:'User Existed'},{response:'Invalid Username or Password'},{response:'Server Error'}];

exports.post = function (req, res) {
    if(req.body.type === "local"){
        var newUser = new User();
            newUser.first_name = req.body.first_name;
            newUser.last_name = req.body.last_name;
            newUser.email = req.body.email;
            newUser.password = newUser.generateHash(req.body.password);
            newUser.type = {name: req.body.type, id:''};
            newUser.role = req.body.role;
        
        User.findOne({email: req.body.email}, function (err, user) {
            if (err) {
                res.json(error_return[2]); 
                return;
            }
            if (!user){
                newUser.save(function(error, result){
                    if(error)
                        res.json(error_return[2]);
                    res.json({response:result});
                });
                return;
            }
            res.json(error_return[0]);
        });
    }else if(req.body.type === "login"){
        User.findOne({email: req.body.email}, function (err, user) {
            if (err) {
                res.json(error_return[2]); 
                return;
            }
            if (!user){
                res.json(error_return[1]);
                return;
            }
            if (!user.validPassword(req.body.password)){
                res.json(error_return[1]);
                return;
            }
            res.json({response:user});
        });
    }else if(req.body.type === "facebook"){
        var newUser = new User();
            newUser.first_name = req.body.response.first_name;
            newUser.last_name = req.body.response.last_name;
            newUser.email = req.body.response.email;
            newUser.type = {name: req.body.type, id:req.body.response.id};
            newUser.role = req.body.role;
            newUser.email_validate = true;
            newUser.profile_image = req.body.response.picture.data.url;

        User.findOne({email: req.body.response.email}, function (err, user) {
            if (err) {
                res.json(error_return[2]); 
                return;
            }
            if (!user){
                newUser.save(function(error, result){
                    if(error)
                        res.json(error_return[2]);
                    res.json({response:result});
                });
            }else if(user){
                User.findOneAndUpdate({email:req.body.response.email}, 
                    {$set: { profile_image: req.body.response.picture.data.url }}, 
                    function(err,result){
                        if(err){
                            res.json(error_return[2]); 
                            return;
                        }
                        res.json({response:result});
                    })
            }
        });
    }
};

exports.get = function (req, res) {
    if(req.params.discount && req.params.discount === "discount"){
        User.find(function( err, user){
            res.json({response:user});
        })
    }else{
        var page = parseInt(req.params.page),
            size = parseInt(req.params.size),
            type = req.params.type,
            skip = page > 0 ? ((page - 1) * size) : 0;
        User.find({'role.type':type}, null, {
            skip: skip,
            limit: size
        }, function (err, user) {
            if(err) {
                res.json(error_return[2]);
            } else {
                User.count({'role.type':type},function( err, count){
                    res.json({response:{count:count,user:user}});
                })
            }
        });
    }
};

exports.discount = function (req, res) {
    if(req.params.discount === "discount"){
        User.find(function( err, user){
            res.json({response:user});
        })
    }
};

exports.update = function (req, res){
    var data = req.body;
    console.log(req.body)
    if(data.types === 'password'){
        User.findOne({_id:  req.body.id}, function (err, user_pass) {
            if (user_pass.validPassword(req.body.password.old)) {
                User.update({_id: req.body.id}, { $set: {password:bcrypt.hashSync(req.body.password.new, bcrypt.genSaltSync(8), null)}}).exec(function(err,user){
                    User.findOne({_id: req.body.id}).exec(function(err,user_details){
                        res.json({response:{updated:user,user:user_details}});
                    });
                });
            }else{
                res.json({response:'Old password mismatch'}); 
            }
        });
    }else if(data.types === 'information'){
        User.update({_id: req.body._id}, { $set: {first_name:req.body.first_name,last_name:req.body.last_name,email:req.body.email,phone:req.body.phone}}).exec(function(err,user){
            if(err){
                res.json({response:'Server Error'});
            }else{
                User.findOne({_id: req.body._id}).exec(function(err,user_details){
                    res.json({response:{updated:user,user:user_details}});
                });
            }
        });
    }else if(data.types === 'address'){
        // console.log('d')
        User.update({_id: req.body._id}, { $set: {'billing_address.address_1':req.body.billing_address[0].address_1,'billing_address.state':req.body.billing_address[0].state,'billing_address.address_2':req.body.billing_address[0].address_2,'billing_address.city':req.body.billing_address[0].city,'billing_address.postcode':req.body.billing_address[0].postcode,'shipping_address.address_1':req.body.shipping_address[0].address_1,'shipping_address.state':req.body.shipping_address[0].state,'shipping_address.address_2':req.body.shipping_address[0].address_2,'shipping_address.city':req.body.shipping_address[0].city,'shipping_address.postcode':req.body.shipping_address[0].postcode}}).exec(function(err,user){
            console.log(user,err)
            if(err){
                res.json({response:'Server Error'});
            }else{
                User.findOne({_id: req.body._id}).exec(function(err,user_details){
                    res.json({response:{updated:user,user:user_details}});
                });
            }
        });
    }
}