var express = require("express");
var router = express.Router();
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var mysqlConnection = require('../connection');
const mysql = require('mysql');

router.post('/login', (req, res) => {
/*
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(req.body.password, salt, (err, hash) => {
      console.log(hash)
    });
  });*/
  //password-oxyjoy@password
  var password = '$2a$10$fp92X1kwB7tWeazcKHQZ/Ono4SEDNevYJSLF3bLVls3QxrzYmWBfW';

  if(req.body.username == "oxyjoy@admin"){
    console.log("yes");
    bcrypt.compare(req.body.password, password, (err, isMatch) => {
      if (err) console.log(err);
      console.log(isMatch)
      if (isMatch) {
        var token = jwt.sign({userID: 1}, 'oxyjoy-admin-secret', {expiresIn: '2h'});
        res.send({token});
      }
      else{
        return res.sendStatus(401);
      }
    });
  }
  else{
    return res.sendStatus(401);
  }
});

module.exports = router;
