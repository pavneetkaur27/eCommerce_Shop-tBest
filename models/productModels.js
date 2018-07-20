var  mongoose =  require('mongoose');

var productModel =mongoose.Schema({
        productName                         : String,
        productPrice                        : Number,
        productDesc                         : String,
        productQuantity                     : Number,
        productPhoto                        : [String]
    }
);

module.exports = mongoose.model('productlist',productModel);