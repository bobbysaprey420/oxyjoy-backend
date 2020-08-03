const express = require('express');
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
const app = express();
var mysqlAdmin = require('node-mysql-admin');
app.use(mysqlAdmin(app));
var cors = require('cors')
app.use(cors());
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

const pathToRegexp = require('path-to-regexp');

// Use JWT auth to secure the API
const unprotected = [
    pathToRegexp('/*'),
    pathToRegexp('/user*'),
    pathToRegexp('/cart*'),
    pathToRegexp('/product*'),
    pathToRegexp('/productType*'),
    pathToRegexp('/medicine*'),
    pathToRegexp('/comp_medicine*'),
    pathToRegexp('/medi_branch*'),
    pathToRegexp('/subcategory*'),
    pathToRegexp('/manufacturer*'),
    pathToRegexp('/brand*'),
    '/admin/login'
];




var mysqlConnection = require('./connection')
app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header("content-type", "application/json; charset=utf-8")
    next();
  });

app.use(expressJwt({secret: 'oxyjoy-admin-secret', algorithms: ['RS256']}).unless({path: unprotected}));

app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
      res.status(401).send('invalid token...');
    }
});


app.use('/uploads', express.static('uploads'));
app.use('/direct_uploads', express.static('direct_uploads'));



// Create the database
app.get('/createdb', (req,res) => {
    let sql = 'CREATE DATABASE medicalDB'
    mysqlConnection.query(sql, (err, result) => {
        if(err) throw err;
        console.log(result);
        res.send('Database Created');
    })
})

var productRoutes = require("./routes/product");
var userIndex = require("./routes/user")
var cart = require("./routes/cart");
var directOrder = require("./routes/direct_order")

//product folder
var product = require("./routes/product/product")
var productType = require("./routes/product/product_type")
var medicineType = require("./routes/product/medicine_type")
var companyMedicine = require("./routes/product/company_medicine")
var medicineBranch = require("./routes/product/medicine_branch")
var subcategory = require("./routes/product/subcategory")
var manufacturer = require("./routes/product/manufacturer")
var brandName = require("./routes/product/brand_name")


//adminRoutes
var adminRoutes    = require('./routes/admin');

app.get('/tab', (req,res) => {
    res.render('tab');
  });


app.use("/", productRoutes);
app.use("/", directOrder)
app.use("/user", userIndex);
app.use("/cart", cart);

app.use("/product", product);
app.use("/productType", productType);
app.use("/medicine", medicineType);
app.use("/comp_medicine", companyMedicine);
app.use("/medi_branch", medicineBranch);
app.use("/subcategory", subcategory);
app.use("/manufacturer", manufacturer);
app.use("/brand", brandName);
app.use("/admin", adminRoutes);

app.use(function*(next) {
    if (this.path.startsWith('/myadmin')) {
        if (this.status === 404 || this.status === '404') {
            delete this.res.statusCode
        }
        this.respond = false
        expressApp(this.req, this.res)
    }
});


app.listen('3000', () => {
    console.log('Server started at port 3000');
})

// https://api.mlab.com/api/1/databases/ca-ecell/collections/users?f={%22__v%22:0,%22date%22:%200,%22password%22:0,%22_id%22:0}&apiKey=bBu-CE3KYMZThp1b8Caik1nV4CAF3Nlx
