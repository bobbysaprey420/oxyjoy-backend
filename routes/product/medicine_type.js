var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../../connection')

// create Type of medicine table
router.get('/create-medicine-type-table', (req, res) => {
  let sql = "CREATE TABLE medicine_type(medicine_type_id INT AUTO_INCREMENT PRIMARY KEY, medicine_type_name TEXT not null, medicine_type_desc TEXT)"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in creating table", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// insert Type of medcine in the Type of medicine bank by making a post request
router.post('/insert-medicine-type', (req, res) => {
  console.log(req.body)
 var medicine_type_name  = req.body.medicine_type_name;
 var medicine_type_desc  = req.body.medicine_type_desc || null;

 if(!medicine_type_name){
   console.log("Invalid insert, medicine type name cannot be empty");
   res.status(500).send({ error: 'Compolsary filed cannot be empty' })
 }
 else{
   var value    = [[medicine_type_name, medicine_type_desc]];
   let sql = "INSERT INTO medicine_type (medicine_type_name, medicine_type_desc) VALUES ?"
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

// Fetch the entire table of the type of medicine
router.get('/fetch-medicines-type', (req, res) => {
  let sql = "SELECT * FROM medicine_type"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching medicine type", message : err})
    }
    else{
      res.send(result);
    }
    })
});

// Fetch a particular type of medicine
router.get('/fetch-medicine-type/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM medicine_type WHERE medicine_type_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching type of medicine", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// update the type of medicine from the table
router.put('/update-medicine-type/:id', function(req, res) {

  var error = []
   if(req.body.medicine_type_name){
    let sql = "UPDATE medicine_type SET medicine_type_name=" +mysql.escape(req.body.medicine_type_name) + " WHERE medicine_type_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.medicine_type_desc){
    let sql = "UPDATE medicine_type SET medicine_type_desc=" +mysql.escape(req.body.medicine_type_desc) + " WHERE medicine_type_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the type of medicine table is successful'});
   else
   res.send({error : error});
});

// delete a particular type of medicine from the table
router.delete('/delete-medicine-type/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM medicine_type WHERE medicine_type_id=" + mysql.escape(id);
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
