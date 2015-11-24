var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://localhost/supreme_kinetic'),
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
            var user = new User(
                {
                    first_name: 'Gebe',
                    last_name: 'Lim',
                    email: 'dennis@dennis.com',
                    password: '123456',
                    profile_image: '',
                    company_name: '',
                    role: {type:'admin', level:'1'}
                }
            );
            user.save(function(err, user){
                if(err)
                    res.json(err);
                res.json(user);
            });
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
