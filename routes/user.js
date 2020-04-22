var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')

// create user table
router.get('/create-user-table', (req, res) => {
    let sql = "CREATE TABLE user(user_id VARCHAR(1024) PRIMARY KEY NOT NULL, name VARCHAR(256) NOT NULL)"
    mysqlConnection.query(sql, (err, result) => {
      if(err){
        res.send({ error : "Error in creating table", message : err})
      } 
      else{
        res.send(result);
      }
    })
});

  // insert address in the table by making a post request
router.post('/insert-user', (req, res) => {
    console.log(req.body.mobile_no)
   var name  = req.body.name;
   var user_id = req.body.user_id;
   if(!name || !user_id){
     console.log("Invalid insert, name or user id cannot be null");
     res.status(500).send({ error: 'User_id not found' })
   }
   else{
     var value    = [[user_id, name]];
     let sql = "INSERT INTO user (user_id, name) VALUES ?"
     mysqlConnection.query(sql, [value] , (err, result) => {
      if(err){
        res.status(500).send({ error : "Error in inserting table", message : err})
      } 
      else{
        res.send(result);
      }
     })
   }
});

router.get('/fetch-user/:id', (req, res) => {
    var id = req.params.id;
    let sql = "SELECT * FROM user WHERE user_id="  + mysql.escape(id);
    mysqlConnection.query(sql , (err, result) => {
      if(err){
        res.status(500).send({ error : "Error in fetching  of a user in table", message : err})
      } 
      else{
        res.send(result);
      }
    })
});

// update the address from the table using address id
router.put('/update-user/:id', function(req, res) {
  if(req.body.name){
   let sql = "UPDATE user SET name= " +mysql.escape(req.body.name) + " WHERE user_id=" + mysql.escape(req.params.id);
   mysqlConnection.query(sql, (err, result) => {
      if(err) {
        res.send({error : error});
      }
      else
      res.send({success: 'Updating the address table is successful'});
   })
  }
  else{
    res.send({error : "all fields empty"})
  }
});

// delete a particular medicine from the table
router.delete('/delete-user/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM user WHERE user_id=" + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in deleting", message : err})
    } 
    else{
      res.send({success : "Successfull"});
    }
  })
})




// create address table
router.get('/create-address-table', (req, res) => {
  let sql = "CREATE TABLE address(address_id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(1024) NOT NULL, address VARCHAR(5000), landmark VARCHAR(1000), city VARCHAR(128), state VARCHAR(128), mobile_no VARCHAR(128), FOREIGN KEY (user_id) REFERENCES user(user_id))"
  mysqlConnection.query(sql, (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in creating table", message : err})
    } 
    else{
      res.send(result);
    }
  })
});

  // insert address in the table by making a post request
router.post('/insert-address', (req, res) => {
    console.log(req.body.mobile_no)
   var user_id  = req.body.user_id;
   var address = req.body.address || null;
   var landmark  = req.body.landmark || null;
   var city  = req.body.city || null;
   var state  = req.body.state || null;
   var mobile_no  = req.body.mobile_no || null;
 
   if(!user_id){
     console.log("Invalid insert, user_id cannot be null");
     res.status(500).send({ error: 'User_id not found' })
   }
   else{
     var value    = [[user_id, address, landmark, city, state, mobile_no]];
     let sql = "INSERT INTO address (user_id, address, landmark, city, state, mobile_no) VALUES ?"
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

  // Fetch the entire table of the addresses
router.get('/fetch-alladdress', (req, res) => {
    let sql = "SELECT * FROM address"
    mysqlConnection.query(sql , (err, result) => {
      if(err){
        res.status(500).send({ error : "Error in fetching address from table", message : err})
      } 
      else{
        res.send(result);
      }
    })
});

// Fetch a particular address by its address-id
router.get('/fetch-address-addressid/:id', (req, res) => {
    var id = req.params.id;
    let sql = "SELECT * FROM address WHERE address_id="  + mysql.escape(id);
    mysqlConnection.query(sql , (err, result) => {
      if(err){
        res.status(500).send({ error : "Error in fetching a address of a user in table", message : err})
      } 
      else{
        res.send(result);
      }
    })
});

// Fetch a address from the address table by user_id
router.get('/fetch-address-userid/:id', function(req, res) {
    var id = req.params.id;
    var sql = "SELECT * FROM address WHERE user_id="  + mysql.escape(id);
    mysqlConnection.query(sql, function(err, result) {
      if(err){
        res.status(500).send({ error : "Error in fetching a address with user id table", message : err})
      } 
      else{
        res.send(result);
      }
    })
});

// update the address from the table using address id
router.put('/update-address/:id', function(req, res) {
   var error = []
   if(req.body.user_id){
    let sql = "UPDATE address SET user_id= " +mysql.escape(req.body.user_id) + " WHERE address_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.address){
    let sql = "UPDATE address SET address= " +mysql.escape(req.body.address) + " WHERE address_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.landmark){
    let sql = "UPDATE address SET landmark= " +mysql.escape(req.body.landmark) + " WHERE address_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.city){
    let sql = "UPDATE address SET city= " +mysql.escape(req.body.city) + " WHERE address_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.state){
    let sql = "UPDATE address SET state= " +mysql.escape(req.body.state) + " WHERE address_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.mobile_no){
    let sql = "UPDATE address SET mobile_no= " +mysql.escape(req.body.mobile_no) + " WHERE address_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(error.length == 0)
   res.send({success: 'Updating the address table is successful'});
   else
   res.send({error : error});

});

// delete a particular medicine from the table
router.delete('/delete-address/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM address WHERE address_id=" + mysql.escape(id);
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
