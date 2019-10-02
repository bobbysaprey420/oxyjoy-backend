const mysql = require('mysql');

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'medicalDB'
  });
  
  
  db.connect(function(err) {
    if (err) throw err;
    console.log('connected!');
  });

  module.exports = db;