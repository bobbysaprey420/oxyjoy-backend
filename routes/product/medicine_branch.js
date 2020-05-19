var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../../connection')

// create medicine branch table
router.get('/create-medicine-branch-table', (req, res) => {
  let sql = "CREATE TABLE medicine_branch(medicine_branch_id INT AUTO_INCREMENT PRIMARY KEY, medicine_branch_name TEXT not null, medicine_branch_desc TEXT)"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in creating table", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// insert medicine branch in the medicine branch by making a post request
router.post('/insert-medicine-branch', (req, res) => {
  console.log(req.body)
 var medicine_branch_name  = req.body.medicine_branch_name;
 var medicine_branch_desc  = req.body.medicine_branch_desc || null;

 if(!medicine_branch_name){
   console.log("Invalid insert, medicine branch name cannot be empty");
   res.status(500).send({ error: 'Compolsary filed cannot be empty' })
 }
 else{
   var value    = [[medicine_branch_name, medicine_branch_desc]];
   let sql = "INSERT INTO medicine_branch (medicine_branch_name, medicine_branch_desc) VALUES ?"
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

// Fetch the entire table of the medicine branch
router.get('/fetch-medicines-branch', (req, res) => {
  let sql = "SELECT * FROM medicine_branch"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching medicine branch", message : err})
    }
    else{
      res.send(result);
    }
    })
});

// Fetch a particular medicine branch
router.get('/fetch-medicine-branch/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM medicine_branch WHERE medicine_branch_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a medicine branch", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// update the medicine branch from the table
router.put('/update-medicine-branch/:id', function(req, res) {

  var error = []
   if(req.body.medicine_branch_name){
    let sql = "UPDATE medicine_branch SET medicine_branch_name=" +mysql.escape(req.body.medicine_branch_name) + " WHERE medicine_branch_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.medicine_branch_desc){
    let sql = "UPDATE medicine_branch SET medicine_branch_desc=" +mysql.escape(req.body.medicine_branch_desc) + " WHERE medicine_branch_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the medicine branch table is successful'});
   else
   res.send({error : error});
});

// delete a particular medicine branch from the table
router.delete('/delete-medicine-branch/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM medicine_branch WHERE medicine_branch_id=" + mysql.escape(id);
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
