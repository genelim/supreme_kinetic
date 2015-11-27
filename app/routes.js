var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/supreme_kinetic'),
    Role = require('./models/role.js')(db);
    User = require('./models/user.js')(db);

module.exports = function(app) {

    app.route('/api/user')
        .get(function(req, res, next) {
            User.find(function(err, user){
                 if(err)
                    res.json(err);
                res.json(user);
            });
        })
        .post(function(req, res, next) {
            var error_return = [{response:'User Existed'},{response:'Invalid Username or Password'}];

            if(req.body.type === "local"){
                var newUser = new User();
                newUser.first_name = req.body.first_name;
                newUser.last_name = req.body.last_name;
                newUser.email = req.body.email;
                newUser.password = newUser.generateHash(req.body.password);
                newUser.type = req.body.type;
                
                User.findOne({email: req.body.email}, function (err, user) {
                    if (err) {
                        res.json(err); 
                        return;
                    }
                    if (!user){
                        newUser.save(function(error, result){
                            if(error)
                                res.json(error);
                            res.json(result);
                        });
                        return;
                    }
                    res.json(error_return[0]);
                });
            }else if(req.body.type === "login"){
                User.findOne({email: req.body.email}, function (err, user) {
                    if (err) {
                        res.json(err); 
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
                    res.json(user);
                });
            }
            

            
        });

    app.route('/api/user/:id')
        .get(function(req, res) {
            User.findById(req.params.id, function(err, user){
                if(err)
                    res.json(err);
                res.json(user);
            });
        })
        .put(function(req, res) {
            User.findById(req.params.id, function(err, user) {
                if (err)
                    res.json(err);
                user.first_name = 'New Name';
                user.save(function(error, updated) {
                    if (error)
                        res.send(error);
                    res.json(updated);
                });

            });
        })
        .delete(function(req, res) {
            User.remove({
                _id: req.params.id
            }, function(err, user) {
                if (err)
                    res.send(err);

                res.json(user);
            });
        });
};
