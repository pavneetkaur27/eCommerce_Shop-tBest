var  mongoose =  require('mongoose');
var productlists    =require('./productModels');

var loginModel = mongoose.Schema({
        username                            :String,
        password                            :String,
        phone                               :String,
        city                                :String,
        productId                           :[{"productids":String , "quantity":Number}],
        productQuantity                     :[String],

    }
);


module.exports= mongoose.model('login',loginModel);
