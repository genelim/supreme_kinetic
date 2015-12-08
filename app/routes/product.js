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
    new_product.name = 'name';
    new_product.model = 'model';
    new_product.sku = 123;
    new_product.brand = 'brand';
    new_product.price = 123;
    new_product.category = 'category';
    new_product.image = '';
    new_product.description = 'description';
    new_product.size = ['XL','L'];
    new_product.color = ['Blue','#000'];
    new_product.quantity = 2;

    new_product.save(function(error, product){
        if(error)
            res.json(error);
        res.json(product);
    });
}

exports.get = function (req, res) {
    Product.find(function (err, product) {
        if(err) {
            res.json(err);
        } else {
            res.json(product);
        }
    });
};