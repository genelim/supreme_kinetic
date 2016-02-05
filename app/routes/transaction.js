var mongoose = require('mongoose'),
    db = mongoose.createConnection('mongodb://127.0.0.1/supreme_kinetic'),
    User = require('../models/user.js')(db),
    Product = require('../models/product.js')(db);
    Cart = require('../models/cart.js')(db);

exports.add_to_cart = function (req, res) {
    Cart.findOne({'user':req.body.user._id}).exec(function(err,user){
    	if(err){
			res.json({response:error});
    	}else if(user){
    		Cart.findOneAndUpdate({'user':req.body.user._id}, {$push: {product:{product_id:req.body.product._id,quantity:req.body.quantity,size:req.body.size,color:req.body.color}}}).exec(function(err,cart){
				res.json({response:cart});
    		})
    	}else if (!user){
			var new_cart = new Cart();
		    new_cart.product.push({product_id:req.body.product._id,quantity:req.body.quantity,size:req.body.size,color:req.body.color});
		    new_cart.user = req.body.user._id;
            new_cart.status = 'order';

			new_cart.save(function(error, cart){
		        if(error)
		            res.json({response:error});
		        else
		        	res.json({response:cart});
		    });
    	}
    })
};

exports.get = function (req, res) {
    Cart.findOne({'user':req.params.id}).populate('product.product_id').exec(function(err,cart){
    	if(err){
			res.json({response:error});
    	}else if(!cart){
    		res.json({response:0});
    	}else if(cart){
    		res.json({response:cart});
    	}
    })
};

exports.update = function (req, res) {
    Cart.findOneAndUpdate({'_id':req.body.product._id}, {$pull: {'product' : {'_id':req.body.id}}}).exec(function(err,cart){
        res.json({response:cart});
    })
};

exports.cart_update = function(req,res){
    Cart.findOneAndUpdate({'_id':req.body._id}, {$set: req.body}).exec(function(err,cart){
        res.json({response:cart});
    })
}