var express = require('express');
var router = express.Router();
var session = require('express-session');
var bodyParser = require('body-parser');
const controllers = require('../../controllers')
var helper = require('../../helper');
var services = require('../../services');
var multer = require('multer');
var path = require('path');
var models = require('../../models');
var fs = require('fs');

router.get('/add', function (req, res, next) {
    res.render('products/addProducts', {title: 'Add Products', msg: ''});
});

const storage =multer.diskStorage({
    destination:"./public/Upload/Product",
    filename:function (req,file,cb) {
        cb(null,Date.now()+path.extname(file.originalname));
    }
})
const upload = multer({
    storage:storage
});

var myPics=[];

router.post('/add', upload.array('productPhoto', 8), function (req, res, next) {
        var data = req.body;
        console.log(data);
        if (req.body.pname == "" && req.body.pdesc == "" && req.body.price == "" && req.body.quality == "") {
            res.render('user/signup', {title: 'Sign Up', UserData: req.user, msg: 'No field can be empty'})
        } else {
            if ((!isNaN(data.price)) && data.price > 0) {
                if ((!isNaN(data.quantity)) && data.quantity >= 0) {
                    console.log(req.files.length);
                    var len = req.files.length;
                    console.log(req.files);
                    if (req.files != null) {
                        for (var i = 0; i < len; i++) {
                            console.log(req.files);
                            var allowedExtensions = [".png", ".jpg", ".jpeg"];
                            var tempPath = req.files[i].path;
                            var filePath = "../public/Upload/Product/" + req.files[i].filename;
                            var targetPath = path.join(__dirname, filePath);
                            // console.log(filename+" "+ filePath);
                            myPics[i] = req.files[i].filename;
                        }
                        controllers.productControllers.addProducts(req.body, myPics, (err, response) => {
                            if (err) {
                                res.render('products/addProducts', {title: 'Add Products', msg: err})
                            }
                            else {
                                res.render('products/addProducts', {title: 'Add Products', msg: 'Product added'})
                            }
                        })
                    } else {
                        fs.unlink(tempPath, err => {
                            if (err) handleError(err, res);
                            return res.redirect('/product/add');
                        });
                    }
                }
                else {
                    res.render('products/addProducts', {title: 'Add Products', msg: 'Quantity should be valid'});
                }
            } else {
                res.render('products/addProducts', {title: 'Add Products', msg: 'Price should be valid'});
            }
        }
    }
)


module.exports = router;