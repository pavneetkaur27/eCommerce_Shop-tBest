const mongoose = require('mongoose');
const models = require('../models');
var helper = require('../helper');

var createUser = function (payload, callback) {
    let user = new models.users();
    user.username = payload.username.toLowerCase();
    user.password = payload.password;
    user.phone = payload.phone;
    user.city = payload.city;
    user.save(payload, function (error, user) {
        if(error)
            callback(error);
        else{
            callback(null,user);
        }
    })
}

var getOneUser = function ( criteria, projections, options, callback){
    options.lean = true;
    models.users.findOne( criteria, projections, options, callback )
}

var findUsers = function (criteria, projections, options, callback) {
    options.lean = true;
    models.users.find(criteria, projections, options, callback);
}

module.exports = {
    'findUsers':  findUsers,
    'createUser': createUser,
    'getOneUser'    :getOneUser,
}