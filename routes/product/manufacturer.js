var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../../connection')

// create manufacturer table
router.get('/create-manufacturer-table', (req, res) => {
  let sql = "CREATE TABLE manufacturer(manufacturer_id INT AUTO_INCREMENT PRIMARY KEY, manufacturer_name TEXT not null, manufacturer_desc TEXT)"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in creating table", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// insert manufacturer in the manufacturer by making a post request
router.post('/insert-manufacturer', (req, res) => {
  console.log(req.body)
 var manufacturer_name  = req.body.manufacturer_name;
 var manufacturer_desc  = req.body.manufacturer_desc || null;

 if(!manufacturer_name){
   console.log("Invalid insert, manufacturer name cannot be empty");
   res.status(500).send({ error: 'Compolsary filed cannot be empty' })
 }
 else{
   var value    = [[manufacturer_name, manufacturer_desc]];
   let sql = "INSERT INTO manufacturer (manufacturer_name, manufacturer_desc) VALUES ?"
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

// Fetch the entire table of the manufacturer
router.get('/fetch-manufacturers', (req, res) => {
  let sql = "SELECT * FROM manufacturer"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching all manufacturer", message : err})
    }
    else{
      res.send(result);
    }
    })
});

// Fetch a particular manufacturer
router.get('/fetch-manufacturer/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM manufacturer WHERE manufacturer_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a manufacturer", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// update the manufacturer from the table
router.put('/update-manufacturer/:id', function(req, res) {

  var error = []
   if(req.body.manufacturer_name){
    let sql = "UPDATE manufacturer SET manufacturer_name=" +mysql.escape(req.body.manufacturer_name) + " WHERE manufacturer_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.manufacturer_desc){
    let sql = "UPDATE manufacturer SET manufacturer_desc=" +mysql.escape(req.body.manufacturer_desc) + " WHERE manufacturer_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the manufacturer table is successful'});
   else
   res.send({error : error});
});

// delete a particular manufacturer from the table
router.delete('/delete-manufacturer/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM manufacturer WHERE manufacturer_id=" + mysql.escape(id);
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
