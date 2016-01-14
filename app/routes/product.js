var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/supreme_kinetic'),
    User_Role = require('../models/user_role.js')(db),
    Product_Created = require('../models/product_created.js')(db),
    Product_Updated = require('../models/product_updated.js')(db),
    Product_Discount = require('../models/product_discount.js')(db),
    Product_Rating = require('../models/product_rating.js')(db),
    Product_History_View = require('../models/product_history_view.js')(db),
    Product = require('../models/product.js')(db);

exports.post = function (req, res) {
    var new_product = new Product();
    new_product.name = req.body[0].product_main['name'];
    new_product.model = req.body[0].product_main['model'];
    new_product.sku = req.body[0].product_main['sku'];
    new_product.brand = req.body[0].product_main['brand'];
    new_product.price = req.body[0].product_main['price'];
    new_product.sub_category = req.body[0].product_main['category'];
    new_product.main_category = req.body[0].category_type;
    new_product.description = req.body[0].product_main['description'];
    new_product.quantity =  req.body[0].product_main['quantity'];
    new_product.created =  {user:req.body[0].user};

    for(var i=0; i < req.body[0].product_image.length; i++){
        new_product.image.push(req.body[0].product_image[i].path)
    }
    for(var i=0; i < req.body[0].product_color[0].children.length; i++){
        new_product.color.push(req.body[0].product_color[0].children[i].name)
    }
    for(var i=0; i < req.body[0].product_size[0].children.length; i++){
        new_product.size.push(req.body[0].product_size[0].children[i].name)
    }
    for(var i=0; i < req.body[0].product_discount[0].children.length; i++){
        console.log((req.body[0].product_discount[0].children[i]));
        if(req.body[0].product_discount[0].children[i].selected_user === '' || !req.body[0].product_discount[0].children[i]){
            req.body[0].product_discount[0].children[i].selected_user = null;
        }
        new_product.discount.push(req.body[0].product_discount[0].children[i])
    }
    
    if(req.body[0].user.role[0].type === 'admin' && req.body[0].user.role[0].level === 2){
        new_product.status = true;
    }

    new_product.save(function(error, product){
        if(error)
            res.json({response:error});
        res.json({response:product});
    });
};

exports.get = function (req, res) {
    var page = parseInt(req.params.page),
        size = parseInt(req.params.size),
        type = req.params.type,
        skip = page > 0 ? ((page - 1) * size) : 0;
    Product.find({main_category:type}, null, {
        skip: skip,
        limit: size
    }).populate('discount.selected_user').exec(function (err, product) {
        if(err) {
            res.json({response:err});
        } else {
            Product.count({main_category:type},function( err, count){
                res.json({response:{count:count,product:product}});
            })
        }
    });  
};

exports.put = function (req, res) {
    var id = req.body._id;
    delete req.body._id;
    var data = req.body;
    Product.update({_id: id}, { $set: data}).exec(function(err,product){
        res.json({response:product})
    })
};

exports.get_recommended = function (req, res) {
    Product.find({recommended:true}).exec(function (err, product){
        res.json({response:product})
    })
};

exports.sort_price = function (req, res) {
    var page = parseInt(req.query.page),
        size = parseInt(req.query.size),
        type = req.query.type,
        skip = page > 0 ? ((page - 1) * size) : 0;
    Product.find({price:{$gte:req.query.low,$lte:req.query.high},main_category:req.query.category}, null, {
        skip: skip,
        limit: size
    }).exec(function (err, product) {
        if(err) {
            res.json({response:err});
        } else {
            Product.count({price:{$gte:req.query.low,$lte:req.query.high},main_category:req.query.category},function( err, count){
                res.json({response:{count:count,product:product}});
            })
        }
    })
};

exports.sort_category = function (req, res) {
    var page = parseInt(req.query.page),
        size = parseInt(req.query.size),
        type = req.query.category,
        skip = page > 0 ? ((page - 1) * size) : 0;
    Product.find({sub_category:{$in: req.query.sub_category},main_category:req.query.category}, null, {
        skip: skip,
        limit: size
    }).exec(function (err, product) {
        if(err) {
            res.json({response:err});
        } else {
            Product.count({sub_category:{$in: req.query.sub_category},main_category:req.query.category},function( err, count){
                res.json({response:{count:count,product:product}});
            })
        }
    })
};

exports.sort_brand = function (req, res) {
    var page = parseInt(req.query.page),
        size = parseInt(req.query.size),
        type = req.query.category,
        skip = page > 0 ? ((page - 1) * size) : 0;
    Product.find({brand:{$in: req.query.brand},main_category:req.query.category}, null, {
        skip: skip,
        limit: size
    }).exec(function (err, product) {
        if(err) {
            res.json({response:err});
        } else {
            Product.count({brand:{$in: req.query.brand},main_category:req.query.category},function( err, count){
                res.json({response:{count:count,product:product}});
            })
        }
    })
};

exports.product_brand = function (req, res) {
    Product.find({main_category:req.params.type}, 'brand').exec(function (err, product){
        res.json({response:product})
    })
};