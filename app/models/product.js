module.exports = function (connection) {
  	var mongoose = require('mongoose');
      	Schema = mongoose.Schema,
        Product_Created = mongoose.model('Product_Created').schema,
        Product_Updated = mongoose.model('Product_Updated').schema,
        Product_Rating = mongoose.model('Product_Rating').schema,
        Product_Discount = mongoose.model('Product_Discount').schema,
        Product_History_View = mongoose.model('Product_History_View').schema,
        User_Role = mongoose.model('User_Role').schema,
        User = mongoose.model('User').schema;
    
  	var product = new mongoose.Schema({
        name: String,
        model: String,
        sku: Number,
        brand: String,
        price: Number,
        category: String,
        image: [String],
        description: String,
        size: [String],
        color: [String],
        quantity: Number,
        discount: [Product_Discount],
        rating: [Product_Rating],
        favorite: [User],
        wishlist: [User],
        review: [User],
        history_view: [Product_History_View],
        recommended: Boolean,
        created: [Product_Created],
        updated: [Product_Updated]
	});

  	return connection.model('Product', product);
}