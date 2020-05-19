var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../../connection')

// create Brand table
router.get('/create-brand-table', (req, res) => {
  let sql = "CREATE TABLE brand_name(brand_name_id INT AUTO_INCREMENT PRIMARY KEY, brand_name TEXT not null, brand_name_desc TEXT)"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in creating table", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// insert brand name in the brand name by making a post request
router.post('/insert-brand-name', (req, res) => {
  console.log(req.body)
 var brand_name  = req.body.brand_name;
 var brand_name_desc  = req.body.brand_name_desc || null;

 if(!brand_name){
   console.log("Invalid insert, brand name cannot be empty");
   res.status(500).send({ error: 'Compolsary filed cannot be empty' })
 }
 else{
   var value    = [[brand_name, brand_name_desc]];
   let sql = "INSERT INTO brand_name (brand_name, brand_name_desc) VALUES ?"
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

// Fetch the entire table of the brand name table
router.get('/fetch-brand-names', (req, res) => {
  let sql = "SELECT * FROM brand_name"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching all brand names", message : err})
    }
    else{
      res.send(result);
    }
    })
});

// Fetch a particular brand name
router.get('/fetch-brand-name/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM brand_name WHERE brand_name_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a manufacturer", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// update the brand name from the table
router.put('/update-brand-name/:id', function(req, res) {

  var error = []
   if(req.body.brand_name){
    let sql = "UPDATE brand_name SET brand_name=" +mysql.escape(req.body.brand_name) + " WHERE brand_name_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.brand_name_desc){
    let sql = "UPDATE brand_name SET brand_name_desc=" +mysql.escape(req.body.brand_name_desc) + " WHERE brand_name_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the brand name table is successful'});
   else
   res.send({error : error});
});

// delete a particular brand name from the table
router.delete('/delete-brand-name/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM brand_name WHERE brand_name_id=" + mysql.escape(id);
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
