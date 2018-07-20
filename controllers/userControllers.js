var services = require('../services');
var mongoose = require('mongoose');
var helper = require('../helper');


var findUsers = function (criteria, projection, option, callback) {
    services.userServices.findUsers(criteria, projection, option, (err, users) => {
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

var getOneUser = function (criteria, projection, option, callback) {
    services.userServices.getOneUser(criteria, projection, option, (err,user) => {
            if(err) {
                callback(err);
                return;
            } else {
                callback(err,user);
            }
        }
    );
}

var createUser = function (payload, callback) {
   // console.log("hi " + payload);
    services.userServices.createUser(payload, (err) => {
        if (err) {
            callback("Error while saving user");
            return;
        }
        else {
            callback(err); // if no error;
        }
    });
}


module.exports = {
    'findUsers': findUsers,
    'createUser': createUser,
    'getOneUser'    :getOneUser
}