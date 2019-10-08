var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')

// create user table
router.get('/create-user-table', (req, res) => {
    let sql = "CREATE TABLE user(user_id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(256) NOT NULL)"
    mysqlConnection.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send(result);
    })
});

 

// create address table
router.get('/create-address-table', (req, res) => {
    let sql = "CREATE TABLE address(address_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, address VARCHAR(5000), landmark VARCHAR(1000), city VARCHAR(128), state VARCHAR(128), mobile_no INT, FOREIGN KEY (user_id) REFERENCES user(user_id))"
    mysqlConnection.query(sql, (err, result) => {
      if(err) throw err;
      console.log(result);
      res.send(result);
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
       if(err) res.status(500).send({ error: 'User_id null' }) 
       res.json(result);
     })
   }
  })

  // Fetch the entire table of the addresses
router.get('/fetch-alladdress', (req, res) => {
    let sql = "SELECT * FROM address"
    mysqlConnection.query(sql , (err, result) => {
        if(err) res.status(500).send({ error: 'Error in quering in sql' }) 
        res.send(result);
    })
});

// Fetch a particular address by its address-id
router.get('/fetch-address-addressid/:id', (req, res) => {
    var id = req.params.id;
    let sql = "SELECT * FROM address WHERE address_id="  + mysql.escape(id);
    mysqlConnection.query(sql , (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send({ error: 'Error in quering in sql' })
          }
        res.send(result);
    })
});

// Fetch a address from the address table by user_id
router.get('/fetch-address-userid/:id', function(req, res) {
    var id = req.params.id;
    var sql = "SELECT * FROM address WHERE user_id="  + mysql.escape(id);
    mysqlConnection.query(sql, function(err, row, fields) {
      if(err) {
        console.log(err);
        res.status(500).send({ error: 'Error in quering in sql' })
      }
      res.send(row)
    })
});


// update the address from the table using address id
router.put('/update-address/:id', function(req, res) {
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
      let sql = "UPDATE address SET user_id="+mysql.escape(user_id)+", address="+mysql.escape(address)+", landmark="+mysql.escape(landmark)+", city="+mysql.escape(city)+", state="+mysql.escape(state)+", mobile_no="+mysql.escape(mobile_no)+" WHERE address_id=" + mysql.escape(req.params.id);
      mysqlConnection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).send({ error: 'Error in quering in sql' })
          }
          res.send(result);
      })
    }
  });


// delete a particular medicine from the table
router.delete('/delete-address/:id', function(req, res, next) {
var id = req.params.id;
var sql = "DELETE FROM address WHERE address_id=" + mysql.escape(id);
mysqlConnection.query(sql, function(err, result) {
    if(err) {
        console.log(err);
        res.status(500).send({ error: 'Error in quering in sql' })
      }
    res.json({'status': 'success'})
})
})


module.exports = router;
