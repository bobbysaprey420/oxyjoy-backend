const mysql = require('mysql');
var mysqlConnection = require('../connection');
var middlewareObj = {};


middlewareObj.ensureAuthenticated =  function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.send({ status : 0, message : 'Please log in to view that resource'});
}

module.exports = middlewareObj;
