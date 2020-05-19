var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../../connection')

// create company medicine type table
router.get('/create-company-medicine-table', (req, res) => {
  let sql = "CREATE TABLE company_medicine(company_medicine_id INT AUTO_INCREMENT PRIMARY KEY, company_medicine_name TEXT not null, company_medicine_desc TEXT)"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in creating table", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// insert Type of company medicine in the Type of company medicine by making a post request
router.post('/insert-company-medicine-type', (req, res) => {
  console.log(req.body)
 var company_medicine_name  = req.body.company_medicine_name;
 var company_medicine_desc  = req.body.company_medicine_desc || null;

 if(!company_medicine_name){
   console.log("Invalid insert, company medicine name cannot be empty");
   res.status(500).send({ error: 'Compolsary filed cannot be empty' })
 }
 else{
   var value    = [[company_medicine_name, company_medicine_desc]];
   let sql = "INSERT INTO company_medicine (company_medicine_name, company_medicine_desc) VALUES ?"
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

// Fetch the entire table of the company medicine
router.get('/fetch-company-medicines', (req, res) => {
  let sql = "SELECT * FROM company_medicine"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching company medicine", message : err})
    }
    else{
      res.send(result);
    }
    })
});

// Fetch a particular company medicine
router.get('/fetch-company-medicine/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM company_medicine WHERE company_medicine_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a company medicine", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// update the company medicine from the table
router.put('/update-company-medicine/:id', function(req, res) {

  var error = []
   if(req.body.company_medicine_name){
    let sql = "UPDATE company_medicine SET company_medicine_name=" +mysql.escape(req.body.company_medicine_name) + " WHERE company_medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.company_medicine_desc){
    let sql = "UPDATE company_medicine SET company_medicine_desc=" +mysql.escape(req.body.company_medicine_desc) + " WHERE company_medicine_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the company medicine table is successful'});
   else
   res.send({error : error});
});

// delete a particular company medicine from the table
router.delete('/delete-company-medicine/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM company_medicine WHERE company_medicine_id=" + mysql.escape(id);
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
