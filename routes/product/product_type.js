var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../../connection')

// create product type table
router.get('/create-product-type-table', (req, res) => {
  let sql = "CREATE TABLE product_type(product_type_id INT AUTO_INCREMENT PRIMARY KEY, product_type_name TEXT not null, product_type_desc TEXT)"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in creating table", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// insert Type of product in the Type of product by making a post request
router.post('/insert-product-type', (req, res) => {
  console.log(req.body)
 var product_type_name  = req.body.product_type_name;
 var product_type_desc  = req.body.product_type_desc || null;

 if(!product_type_name){
   console.log("Invalid insert, product type name cannot be empty");
   res.status(500).send({ error: 'Compolsary filed cannot be empty' })
 }
 else{
   var value    = [[product_type_name, product_type_desc]];
   let sql = "INSERT INTO product_type (product_type_name, product_type_desc) VALUES ?"
   mysqlConnection.query(sql, [value] , (err, result) => {
     if(err){
       res.status(500).send({ error : "Error in inserting table", message : err})
     }
     else{
       res.send(result);
     }
   })
 }
})

// Fetch the entire table of the type of product
router.get('/fetch-products-type', (req, res) => {
  let sql = "SELECT * FROM product_type"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching product type", message : err})
    }
    else{
      res.send(result);
    }
    })
});

// Fetch a particular type of product
router.get('/fetch-product-type/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product_type WHERE product_type_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching type of product", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// update the type of product from the table
router.put('/update-product-type/:id', function(req, res) {

  var error = []
   if(req.body.product_type_name){
    let sql = "UPDATE product_type SET product_type_name=" +mysql.escape(req.body.product_type_name) + " WHERE product_type_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.product_type_desc){
    let sql = "UPDATE product_type SET product_type_desc=" +mysql.escape(req.body.product_type_desc) + " WHERE product_type_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the type of product table is successful'});
   else
   res.send({error : error});
});

// delete a particular type of product from the table
router.delete('/delete-product-type/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM product_type WHERE product_type_id=" + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in deleting", message : err})
    }
    else{
      res.send({success : "Successfull"});
    }
  })
})

module.exports = router;
