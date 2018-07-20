var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
var helper = require('../helper');
var models = require('../models');
const controllers = require('../controllers');
var multer = require('multer');
var path = require('path');
var mongoose = require('mongoose');
var fs = require('fs');
var users = require('request');
const Product = require('../models/productModels');
/* GET home page. */

router.get('/', function (req, res, next) {
    res.render('index', {title: 'Shopping Clues', err: ''});
});

router.post('/', function (req, res, next) {
    var data = req.body;
    models.users.findOne({'username': data.username.toLowerCase(), 'password': data.password}, function (err, user) {
        if (err)
            return res.send(err);
        else if (!user)
            return res.render('index', {title: 'Shopping Clues', err: 'Invalid username and password'});
        // console.log("hlo "+req.body.toString);
        if (data.username == 'pavi') {
            res.redirect('/product/add');
        }
        else {

            username = req.body.username;
            req.session.user = username;
            res.redirect('/productlist');
        }
    })
});

router.get('/signup', function (req, res, next) {
    req.session.destroy();
    res.render('user/signup', {title: 'SignUp', msg: ''});
});

router.post('/signup', function (req, res) {
        var phone1 = req.body.phone;
        username = req.body.username;
        req.session.user = username;
        if (req.body.username == "" && req.body.password == "" && req.body.phone == "" && req.body.city == "") {
            res.render('user/signup', {title: 'Sign Up', UserData: req.user, msg: 'No field can be empty'})
        } else {
            if (!isNaN(phone1) && helper.validations.isValidNumbers(phone1)) {
                controllers.userControllers.findUsers({username: req.body.username}, {username: 1}, {}, (err, response) => {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        //console.log("hlo "+response[0]);
                        if (response[0] != undefined) {
                            if (response[0].username == req.body.username) {
                                res.render('user/signup', {title: 'Sign Up', UserData: req.user, msg: 'User Already Exist'})
                            }
                        } else {
                            controllers.userControllers.createUser(req.body, (err, response) => {
                                if (err) {
                                    res.render('user/signup', {title: 'Sign Up', UserData: req.user, msg: err})
                                }
                                else {
                                    res.render('user/signup', {title: 'Sign Up', UserData: req.user, msg: 'User Added'})
                                }
                            })
                        }
                    }
                })
            }
            else {
                res.render('user/signup', {title: 'Sign Up', UserData: req.user, msg: 'Phone number is not valid'})
            }
        }
    }
);

router.get('/productlist', function (req, res, next) {
    //console.log(req.user );
    name = req.session.user;
    res.render('shop/product', {title: "List of products", msg: '', username: name});
});

router.post('/productlist', function (req, res, next) {
    // var option=req.body;
    var perPage = 6;
    var page = req.body.page || 1;
    console.log("hi "+req.body.value);
    if(req.body.sort){
        var val = req.body.sort;
        req.session.sortvalue=val;
    }
    else if(req.session.sortvalue && req.body.value!='Choose Criteria'){
        val=req.session.sortvalue;
    }
    console.log(req.body.sort);
    models.productModels.find({}).skip((perPage * page) - perPage).limit(perPage).sort(val).exec(function (err, response) {
        models.productModels.count().exec(function (err, count) {
            if (err) return next(err)
            else
            //console.log("hi "+count+" "+page);
                res.send({response: response, pageNo: page, pages: Math.ceil(count / perPage)});
        })
    })
    //console.log(req.page, req.body);
    //console.log(option+" "+data);
    /*  controllers.productControllers.findProducts({},{productName:1,productQuantity:1,productPrice:1,productDesc:1,productPhoto:1},option,(err,response)=>{
          if(err){
              console.log(err);
              res.status(400).send(err);
          }else{
              //console.log(response[0].productPhoto);
              res.send(response);
          }
      })*/
});


router.post('/addtocart/:data', function (req, res, next) {
    var id = req.params.data;
    var c = -1;
    var objProduct = new Object();
    //console.log(id);
    var name = req.session.user;
    var quantity = req.body.quant;
    console.log("hi g" + quantity + " " + name);
    if (name != undefined) {
        controllers.userControllers.getOneUser({username: name}, {
            productId: 1,
        }, {}, (err, responses) => {
            if (err) {
                res.status(400).send(err);
            } else {
                var length = responses.productId.length;
                var pid = responses.productId?responses.productId:[];
                var prevqty = 0;
                for (var i = 0; i < length; i++) {
                    if (responses.productId[i].productids == id) {
                        prevqty = responses.productId[i].quantity;
                        pid.splice(i, 1);
                        break;
                    }
                }
               // console.log(pid);
                objProduct.productids = id;
                objProduct.quantity = quantity;
                pid.push(objProduct);
                models.users.updateOne({username: name}, {productId: pid}, (err, resp) => {
                    if (err) {
                        res.status(400).send(err);
                    }
                    else {
                        res.send(" Product Added Succesfully");
                    }
                })
                controllers.productControllers.findProducts({_id: id}, {productQuantity: 1}, {}, (err, val) => {
                    if (err) {
                        res.status(400).send(err);
                    } else {
                        var changeqty = 0;
                        //console.log(val[0].productQuantity+" "+quantity+" "+prevqty);
                        if (c == 0) {
                            changeqty = ((val[0].productQuantity) + parseInt(prevqty - quantity));
                        } else {
                            changeqty = (val[0].productQuantity - quantity);
                        }
                        console.log("bub " + changeqty);
                        models.productModels.updateOne({_id: id}, {productQuantity: changeqty}, (err, res) => {
                            if (err) {
                                res.status(400).send(err);
                            }
                        });
                    }
                });
                ;
            }
        })
    } else {
        res.send( "Please Login To add to cart");
    }

});


router.get('/viewcart', function (req, res, next) {
    var name = req.session.user;
    var qty = [];
    if (name != undefined) {
        models.users.findOne({username: name}, {productId: 1}, (err, response) => {
            if (err) {
                return res.send(err);
            } else {
                var ids = [];
                //   var id = mongoose.mongo.ObjectId(ids);
                console.log(response);
                var len = response.productId.length;
                //console.log(response);
                for (var i = 0; i < len; i++) {
                    ids[i] = mongoose.mongo.ObjectId(response.productId[i].productids);
                }
                //  console.log(len);
                controllers.productControllers.findProducts({_id: {$in: ids}}, {
                    productName: 1,
                    productQuantity: 1,
                    productPrice: 1,
                    productPhoto: 1
                }, {}, (err, responses) => {
                    if (err) {
                        console.log(err);
                        res.status(400).send(err);
                    } else {
                        console.log(responses);
                        var val = 0;
                        for (var j = 0; j < len; j++) {
                            for (var k = 0; k < len; k++) {
                                if (responses[j]._id == response.productId[k].productids) {
                                    qty[val] = response.productId[k].quantity;
                                    val++;
                                    break;
                                }
                            }
                        }
                        console.log("hlo " + responses[0].productPhoto[0]);
                        res.render('shop/viewcart', {
                            title: "View your Cart",
                            productlist: responses,
                            username: name,
                            qty: qty
                        });
                    }
                });
            }
        });
    } else {
        res.render('error', "Please Login To view cart");
    }
});

router.post('/removefromcart', function (req, res, next) {
    var name = req.body.username;
    var productid = req.body.id;

    controllers.userControllers.getOneUser({username: name}, {productId: 1}, {}, (err, responses) => {
        if (err) {
            res.status(400).send(err);
        } else {
            var length = responses.productId.length;
            var i
            for (i = 0; i < length; i++) {

                if (responses.productId[i] == productid) {
                    break;
                }
            }
            for (var j = i; j < length - 1; j++) {
                responses.productId[j] = responses.productId[j + 1];
            }
            responses.productId.length--;
            models.users.updateOne({username: name}, {productId: responses.productId}, (err, resp) => {
                if (err) {
                    res.status(400).send(err);
                }
                else {
                    res.send("ss");
                }
            });
        }
    });
});

router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
