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
        new_product.discount.push(req.body[0].product_discount[0].children[i])
    }

    new_product.save(function(error, product){
        if(error)
            res.json({response:error});
        res.json({response:product});
    });
};

exports.get = function (req, res) {
    Product.find(function (err, product) {
        if(err) {
            res.json({response:err});
        } else {
            res.json({response:product});
        }
    });
};