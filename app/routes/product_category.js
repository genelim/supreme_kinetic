var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/supreme_kinetic'),
    Product_Category = require('../models/product_category.js')(db);

exports.post = function (req, res) {

    var sub_category_set = req.body[0].category.name;
    var category_type = req.body.type;
    var sub_category = new Product_Category({
        sub_category: req.body[0].category.name
    });
    Product_Category.find({sub_category:sub_category_set}, function (err, product_category) {
        if(err) 
            res.json({response:err});
        
        if(product_category.length){
            res.json({response:'Category Existed'})
        }else{
            sub_category.save(function(error,result){
                res.json({response: result})
            })
        }
    });
}

exports.get = function (req, res) {
    var type = req.params.type;
    Product_Category.find(function (err, product_category) {
        if(err) {
            res.json({response:err});
        } else {
            res.json({response:product_category});
        }
    });
};

exports.delete = function (req, res) {
    Product_Category.remove({_id: req.params.id}, function (err, product_category) {
        if(err) {
            res.json({response:err});
        } else {
            res.json({response:product_category});
        }
    });
};