var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/supreme_kinetic'),
    User_Role = require('../models/user_role.js')(db),
    User = require('../models/user.js')(db);

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

// module.exports = function(app) {

//     app.route('/api/user')
//         // .get(function(req, res, next) {
//         //     User.find(function(err, user){
//         //          if(err)
//         //             res.json(err);
//         //         res.json(user);
//         //     });
//         // })
//         .post(function(req, res, next) {
//             var error_return = [{response:'User Existed'},{response:'Invalid Username or Password'},{response:'Server Error'}];

//             if(req.body.type === "local"){
//                 var newUser = new User();
//                 newUser.first_name = req.body.first_name;
//                 newUser.last_name = req.body.last_name;
//                 newUser.email = req.body.email;
//                 newUser.password = newUser.generateHash(req.body.password);
//                 newUser.type = req.body.type;
//                 newUser.role = req.body.role;
                
//                 User.findOne({email: req.body.email}, function (err, user) {
//                     if (err) {
//                         res.json(error_return[2]); 
//                         return;
//                     }
//                     if (!user){
//                         newUser.save(function(error, result){
//                             if(error)
//                                 res.json(error_return[2]);
//                             res.json({response:result});
//                         });
//                         return;
//                     }
//                     res.json(error_return[0]);
//                 });
//             }else if(req.body.type === "login"){
//                 User.findOne({email: req.body.email}, function (err, user) {
//                     if (err) {
//                         res.json(error_return[2]); 
//                         return;
//                     }
//                     if (!user){
//                         res.json(error_return[1]);
//                         return;
//                     }
//                     if (!user.validPassword(req.body.password)){
//                         res.json(error_return[1]);
//                         return;
//                     }
//                     res.json({response:user});
//                 });
//             }
            

            
//         });

//     app.route('/api/user/:id')
//         .get(function(req, res) {
//             User.findById(req.params.id, function(err, user){
//                 if(err)
//                     res.json(err);
//                 res.json(user);
//             });
//         })
//         .put(function(req, res) {
//             User.findById(req.params.id, function(err, user) {
//                 if (err)
//                     res.json(err);
//                 user.first_name = 'New Name';
//                 user.save(function(error, updated) {
//                     if (error)
//                         res.send(error);
//                     res.json(updated);
//                 });

//             });
//         })
//         .delete(function(req, res) {
//             User.remove({
//                 _id: req.params.id
//             }, function(err, user) {
//                 if (err)
//                     res.send(err);

//                 res.json(user);
//             });
//         });
// };
