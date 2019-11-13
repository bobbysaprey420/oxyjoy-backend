const express = require('express');
var methodOverride = require("method-override");
var bodyParser = require("body-parser");
const app = express();



var mysqlConnection = require('./connection')

app.use(methodOverride("_method"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));




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
var cart = require("./routes/cart")

app.get('/tab', (req,res) => {
    res.render('tab');
  });





app.use("/", productRoutes);
app.use("/user", userIndex);
app.use("/cart", cart);

app.listen('3000', () => {
    console.log('Server started at port 3000');
})

// https://api.mlab.com/api/1/databases/ca-ecell/collections/users?f={%22__v%22:0,%22date%22:%200,%22password%22:0,%22_id%22:0}&apiKey=bBu-CE3KYMZThp1b8Caik1nV4CAF3Nlx