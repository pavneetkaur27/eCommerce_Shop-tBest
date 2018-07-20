var services                = require('../services');
var mongoose                = require('mongoose');
var helper                  = require('../helper');

function checkExistence(req,res,next) {
    controllers.userControllers.findUsers(req.body, {username: ''}, {}, (err, response) => {
        if (err) {
            next(err);
        }
        else {
            res.status(200).json(response.length);
        }
    });
}

function  isValidNumbers(phone) {
    //console.log("hlo " +Object.keys(phone).length);
    if(Object.keys(phone).length == 10){
        return true;
    }
    return false;
}



module.exports ={
    'checkExistense'   :  checkExistence,
    'isValidNumbers'    : isValidNumbers
}