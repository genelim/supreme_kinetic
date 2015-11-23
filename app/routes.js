var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://localhost/supreme_kinetic'),
    User = require('./models/user.js')(db),
    Role = require('./models/role.js')(db);


module.exports = function(app) {
    app.post('/api/user', function(req, res) {
        console.log('in');
        var user = new User(
            {
                first_name: 'Dennis',
                last_name: 'Lee',
                email: 'dennis@dennis.com',
                password: '123456',
                profile_image: '',
                company_name: '',
                role: {type:'admin', level:'1'}
            }
        );
        user.save(function(err){
            if(err)
                console.log(err);
            else
                console.log(user);
        });
    })
};
