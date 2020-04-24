var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')

// create medicine table
router.get('/create-product-table', (req, res) => {
    let sql = "CREATE TABLE medicine(medicine_id INT(11) AUTO_INCREMENT PRIMARY KEY, medicine_name TEXT NOT NULL, COMPOSITION TEXT, HSN_CODE int(11), GST text, price int(11) not null, P_T_R double, P_T_S double, discount_price double, type text, product_description text, insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP)"
    mysqlConnection.query(sql, (err, result) => {
      if(err){
        res.status(500).send({ error : "Error in creating table", message : err})
      } 
      else{
        res.send(result);
      }
    })
 });


 // insert medcine in the medicine bank by making a post request
 router.post('/insert-medicine', (req, res) => {
   console.log(req.body)
  var medicine_name  = req.body.medicine_name;
  var COMPOSITION = req.body.COMPOSITION || null;
  var HSN_CODE  = req.body.HSN_CODE || null;
  var GST  = req.body.GST || null;
  var price   = req.body.price;
  var P_T_R   = req.body.P_T_R  || null;
  var P_T_S = req.body.P_T_S  || null;
  var discount_price = req.body.discount_price   || null;
  var type   = req.body.type || null;
  var product_description  = req.body.product_description  || null;

  if(!medicine_name || !price){
    console.log("Invalid insert, medicine_name or price filed cannot be empty");
    res.status(500).send({ error: 'Compolsary filed cannot be empty' })
  }
  else{
    var value    = [[medicine_name, COMPOSITION, HSN_CODE, GST, price, P_T_R, P_T_S, discount_price, type, product_description]];
    let sql = "INSERT INTO medicine (medicine_name, COMPOSITION, HSN_CODE, GST, price, P_T_R, P_T_S, discount_price, type, product_description) VALUES ?"
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

// Fetch the entire table of the medicine bank except the answer
router.get('/fetch-medicines', (req, res) => {
  let sql = "SELECT medicine_name, COMPOSITION, type, price, product_description, discount_price FROM medicine"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching medicine", message : err})
    } 
    else{
      res.send(result);
    }
    })
});

// Fetch only medicine name and id from the medicine bank
router.get('/fetch-medicine-and-id', (req, res) => {
  let sql = "SELECT medicine_id, medicine_name FROM medicine"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching", message : err})
    } 
    else{
      res.send(result);
    }
    })
});

// Fetch a particular medicine from the medicine bank
router.get('/fetch-medicine/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM medicine WHERE medicine_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching medicine", message : err})
    } 
    else{
      res.send(result);
    }
  })
});

// update the medicine from the table
router.put('/update-medicine/:id', function(req, res) {

  var error = []
   if(req.body.medicine_name){
    let sql = "UPDATE medicine SET medicine_name=" +mysql.escape(req.body.medicine_name) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.type){
    let sql = "UPDATE medicine SET type=" +mysql.escape(req.body.type) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.COMPOSITION){
    let sql = "UPDATE medicine SET COMPOSITION=" +mysql.escape(req.body.COMPOSITION) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.price){
    let sql = "UPDATE medicine SET price=" +mysql.escape(req.body.price) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.product_description){
    let sql = "UPDATE medicine SET product_description=" +mysql.escape(req.body.product_description) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.discount_price){
    let sql = "UPDATE medicine SET discount_price=" +mysql.escape(req.body.discount_price) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.HSN_CODE ){
    let sql = "UPDATE medicine SET HSN_CODE=" +mysql.escape(req.body.HSN_CODE) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.GST){
    let sql = "UPDATE medicine SET GST=" +mysql.escape(req.body.GST) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.P_T_R  ){
    let sql = "UPDATE medicine SET P_T_R=" +mysql.escape(req.body.P_T_R) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.P_T_S  ){
    let sql = "UPDATE medicine SET P_T_S=" +mysql.escape(req.body.P_T_S) + " WHERE medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the medicine table is successful'});
   else
   res.send({error : error});
});

// delete a particular medicine from the table
router.delete('/delete-medicine/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM medicine WHERE medicine_id=" + mysql.escape(id);
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