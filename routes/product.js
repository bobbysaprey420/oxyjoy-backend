var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')

// create medicine table
router.get('/create-product-table', (req, res) => {
    let sql = "CREATE TABLE medicine(medicine_id INT AUTO_INCREMENT PRIMARY KEY, medicine_name VARCHAR(1000) NOT NULL, type VARCHAR(5000), parent_company VARCHAR(1000) NOT NULL, price FLOAT NOT NULL, product_description TEXT, discount_price FLOAT, insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, taxable BOOLEAN)"
    mysqlConnection.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send(result);
    })
 });

/*  router.get('/tab', (req,res) => {
   res.render('tab');
 }) */


 // insert medcine in the medicine bank by making a post request
 router.post('/insert-medicine', (req, res) => {
   console.log(req.body)
  var medicine_name  = req.body.medicine_name;
  var type = req.body.type || null;
  var parent_company  = req.body.parent_company;
  var price  = req.body.price;
  var product_description  = req.body.product_description || null;
  var discount_price  = req.body.discount_price || null;
  var taxable    = req.body.taxable || null;

  if(!medicine_name || !parent_company || !price){
    console.log("Invalid insert, medicine_name or parent_company or price filed cannot be empty");
    res.status(500).send({ error: 'Cumpolsary filed cannot be empty' })
  }
  else{
    var value    = [[medicine_name, type, parent_company, price, product_description, discount_price, taxable]];
    let sql = "INSERT INTO medicine (medicine_name, type, parent_company, price, product_description, discount_price, taxable) VALUES ?"
    mysqlConnection.query(sql, [value] , (err, result) => {
      if(err) throw err;
      console.log(result);
      res.json(result);
    })
  }
 })

// Fetch the entire table of the medicine bank except the answer
router.get('/fetch-medicines', (req, res) => {
  let sql = "SELECT medicine_name, type, parent_company, price, product_description, discount_price, taxable FROM medicine"
  mysqlConnection.query(sql , (err, result) => {
      if(err) throw err;
      res.json(result);
    })
});

// Fetch only medicine name and id from the medicine bank
router.get('/fetch-medicine-and-id', (req, res) => {
  let sql = "SELECT medicine_id, medicine_name FROM medicine"
  mysqlConnection.query(sql , (err, result) => {
      if(err) throw err;
      res.json(result);
    })
});

// Fetch a particular medicine from the medicine bank
router.get('/fetch-medicine/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM medicine WHERE medicine_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, row, fields) {
    if(err) {
      res.status(500).send({ error: 'Something failed!' })
    }
    console.log(fields)
    res.json(row)
  })
});

// update the medicine from the table
router.post('/update-medicine/:id', function(req, res) {
  var medicine_name  = req.body.medicine_name;
  var type = req.body.type || null;
  var parent_company  = req.body.parent_company;
  var price  = req.body.price;
  var product_description  = req.body.product_description || null;
  var discount_price  = req.body.discount_price || null;
  var taxable    = req.body.taxable || null;
  console.log(req.params.id)
  if(!medicine_name || !parent_company || !price){
    console.log("Invalid insert, medicine_name or parent_company or price filed cannot be empty");
    res.status(500).send({ error: 'Cumpolsary filed cannot be empty' })
  }
  else{
    let sql = "UPDATE medicine SET medicine_name="+mysql.escape(medicine_name)+", type="+mysql.escape(type)+", parent_company="+mysql.escape(parent_company)+", price="+mysql.escape(price)+", product_description="+mysql.escape(product_description)+", discount_price="+mysql.escape(discount_price)+", taxable="+mysql.escape(taxable)+" WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.json(result);
    })
  }
});

// delete a particular medicine from the table
router.delete('/delete-medicine/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM medicine WHERE medicine_id=" + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err) {
      res.status(500).send({ error: 'Something failed!' })
    }
    res.json({'status': 'success'})
  })
})


module.exports = router;