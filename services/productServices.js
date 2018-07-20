const mongoose = require('mongoose');
const models = require('../models');
var helper = require('../helper');

var addProducts = function (payload,pics, callback) {

    let newproduct = new models.productModels();
    newproduct.productName = payload.pname;
    newproduct.productDesc = payload.pdesc;
    newproduct.productPrice = payload.price;
    newproduct.productQuantity = payload.quantity;
    newproduct.productPhoto = pics;
    newproduct.save(payload, function (error, newproduct) {
        if (error)
            callback(error);
        else {
            callback(null, newproduct);
        }
    })
}

var getOneProduct = function ( criteria, projections, options, callback){
    options.lean = true;
    models.productModels.findOne( criteria, projections, options, callback )
}

var findProducts =function (criteria,projection,option,callback) {
    models.productModels.find(criteria, projection, option, callback);
}

var updateProduct = function (user,details, callback) {
    models.productModels.updateOne({_id:user._id},details,callback);
}

module.exports = {
      'addProducts'   : addProducts,
    'updateProduct' :  updateProduct,
    'findProducts'  : findProducts,
    'getOneProduct' : getOneProduct
}