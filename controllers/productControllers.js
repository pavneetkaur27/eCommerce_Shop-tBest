var services = require('../services');
var mongoose = require('mongoose');
var helper = require('../helper');

var addProducts =function (payload,pics,callback) {

    services.productServices.addProducts(payload,pics,function (err,response) {
        if (err) {
            callback("Error while saving product");
            return;
        }
        else {
            callback(err); // if no error;
        }
    });
}

var findProducts = function (criteria, projection, option, callback) {
    services.productServices.findProducts(criteria, projection, option, (err, users) => {
            if (err) {
                callback(err);
                return;
            } else {
                //   console.log("hi "+users);
                callback(err, users)
            }
        }
    );
}

var getOneProduct = function (criteria, projection, option, callback) {
    services.productServices.getOneProduct(criteria, projection, option, (err,user) => {
            if(err) {
                callback(err);
                return;
            } else {
                callback(err,user);
            }
        }
    );
}

var updateProduct = function(user,details,callback) {
    console.log("user details "+details);
    services.productServices.updateProduct(user,details, (err,response) => {
        if(err){
            callback(err);
        }
        else {
            callback(err,response);
        }
    });
}

module.exports = {
    'addProducts'      : addProducts,
    'updateProduct'     : updateProduct,
    'findProducts'      : findProducts,
    'getOneProduct'     :getOneProduct,
}