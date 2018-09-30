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

//implement indexing on username
module.exports= mongoose.model('login',loginModel);
