var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../../connection')

// create subcategory table
router.get('/create-subcategory-table', (req, res) => {
  let sql = "CREATE TABLE subcategory(subcategory_id INT AUTO_INCREMENT PRIMARY KEY, subcategory_name TEXT not null, subcategory_desc TEXT)"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in creating table", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// insert subcategory in the subcategory by making a post request
router.post('/insert-subcategory', (req, res) => {
  console.log(req.body)
 var subcategory_name  = req.body.subcategory_name;
 var subcategory_desc  = req.body.subcategory_desc || null;

 if(!subcategory_name){
   console.log("Invalid insert, subcategory name cannot be empty");
   res.status(500).send({ error: 'Compolsary filed cannot be empty' })
 }
 else{
   var value    = [[subcategory_name, subcategory_desc]];
   let sql = "INSERT INTO subcategory (subcategory_name, subcategory_desc) VALUES ?"
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

// Fetch the entire table of the subcategory
router.get('/fetch-subcategorys', (req, res) => {
  let sql = "SELECT * FROM subcategory"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching subcategory", message : err})
    }
    else{
      res.send(result);
    }
    })
});

// Fetch a particular subcategory
router.get('/fetch-subcategory/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM subcategory WHERE subcategory_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a subcategory", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// update the subcategory from the table
router.put('/update-subcategory/:id', function(req, res) {

  var error = []
   if(req.body.subcategory_name){
    let sql = "UPDATE subcategory SET subcategory_name=" +mysql.escape(req.body.subcategory_name) + " WHERE subcategory_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.subcategory_desc){
    let sql = "UPDATE subcategory SET subcategory_desc=" +mysql.escape(req.body.subcategory_desc) + " WHERE subcategory_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the subcategory table is successful'});
   else
   res.send({error : error});
});

// delete a particular subcategory from the table
router.delete('/delete-subcategory/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM subcategory WHERE subcategory_id=" + mysql.escape(id);
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
