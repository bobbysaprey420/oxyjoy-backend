var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')
var cors = require('cors')
router.use(cors());



// create medicine table
router.get('/create-direct-order-table', (req, res) => {
    let sql = "CREATE TABLE direct_order(order_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id VARCHAR(1024) NOT NULL, imagefile_refernce VARCHAR(1000) NOT NULL , address_id INT NOT NULL, amount FLOAT DEFAULT 0, bill_pdf VARCHAR(256), delivery_date DATE, description VARCHAR(256), status_code int default 0,  status_message VARCHAR(1000) DEFAULT 'NOT CONFIRMED', status_description VARCHAR(1000), tracking_id varchar(256),insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (address_id) REFERENCES address(address_id))"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in creating direct order table' })
        }
        else
        res.send(result);
        })
 });

 router.post('/post-direct-order', (req, res) => {
     const user_id = req.body.user_id;
     const address_id = req.body.address_id;
     const imagefile_refernce=req.body.imagefile_refernce;
     const amount=req.body.amount || 0;
     const bill_pdf=req.body.bill_pdf || null;
     const description=req.body.description || null;
     const status_code=req.body.status_code || 0;
     const status_message=req.body.status_message || "NOT CONFIRMED";
     const status_description=req.body.status_description || null;
     const tracking_id=req.body.tracking_id || null;
     const delivery_date=req.body.delivery_date || null;
     if(!user_id){
        res.status(500).send({ error: 'User Id cannot be null' });
     }
     else{
         var value    = [[user_id, address_id,imagefile_refernce,amount,bill_pdf,description,status_code,status_message,status_description,tracking_id]];
         let sql = "INSERT INTO direct_order(user_id, address_id,imagefile_refernce,amount,bill_pdf,description,status_code,status_message,status_description,tracking_id) VALUES ?"
         mysqlConnection.query(sql, [value] , (err, result) => {
             if(err){
                 res.status(500).send({ error: 'Error in inserting' })
             }
             else
             res.send({ success : "Success"});
        })
    }
 });

 router.get('/get-user-order-detail/:id', (req, res) => {
    let sql = "SELECT * FROM direct_order WHERE user_id =" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in inserting' })
        }
        else
        res.send(result);
   })
 });

 router.get('/get-user-order-detail-byorder_id/:id', (req, res) => {
     var order_id = req.params.id;
    let sql = "SELECT * FROM direct_order WHERE order_id =" + mysql.escape(order_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetchcing' })
        }
        else
        res.send(result);
   })
 });

  router.put('/update-direct-order-status', (req, res) =>{
   var status = req.body.status;
   var order_id = req.body.order_id;
    let sql = "UPDATE direct_order SET status =" + mysql.escape(status) + " WHERE order_id = " + mysql.escape(order_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching all orders details from a user' })
        }
        else{
            res.send({ result : "Status updated" });
        }
    })
});

 router.put('/update-direct-order-status-code-message/:id', (req, res) =>{
   var error = []
    if(req.body.status_code){
     let sql = "UPDATE direct_order SET status_code=" +mysql.escape(req.body.status_code) + " WHERE order_id=" + mysql.escape(req.params.id);
     mysqlConnection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            error.push(err)
        }
     })
    }
    if(req.body.status_message){
     let sql = "UPDATE direct_order SET status_message=" +mysql.escape(req.body.status_message) + " WHERE order_id=" + mysql.escape(req.params.id);
     mysqlConnection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            error.push(err)
        }
     })
    }

    if(req.body.status_description){
     let sql = "UPDATE direct_order SET status_description=" +mysql.escape(req.body.status_description) + " WHERE order_id=" + mysql.escape(req.params.id);
     mysqlConnection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            error.push(err)
        }
     })
    }

    if(req.body.bill_pdf){
     let sql = "UPDATE direct_order SET bill_pdf=" +mysql.escape(req.body.bill_pdf) + " WHERE order_id=" + mysql.escape(req.params.id);
     mysqlConnection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            error.push(err)
        }
     })
    }
    if(req.body.amount){
     let sql = "UPDATE direct_order SET amount=" +mysql.escape(req.body.amount) + " WHERE order_id=" + mysql.escape(req.params.id);
     mysqlConnection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            error.push(err)
        }
     })
    }
    if(req.body.description){
     let sql = "UPDATE direct_order SET description=" +mysql.escape(req.body.description) + " WHERE order_id=" + mysql.escape(req.params.id);
     mysqlConnection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            error.push(err)
        }
     })
    }
    if(req.body.tracking_id){
     let sql = "UPDATE direct_order SET tracking_id=" +mysql.escape(req.body.tracking_id) + " WHERE order_id=" + mysql.escape(req.params.id);
     mysqlConnection.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            error.push(err)
        }
     })
    }

    if(error.length == 0)
    res.send({success: 'Updating the order status-code or status-message table is successful'});
    else
    res.send({error : error});
 });


router.delete('/delete-direct-order-byuser_id/:id', (req, res) => {
    var user_id = req.params.id;
    let sql = "DELETE FROM direct_order WHERE user_id =" + mysql.escape(user_id);
    mysqlConnection.query(sql, (err, result) => {
       if(err){
           console.log(err);
           res.status(500).send({ error: 'Error in deleting a direct order by  user from direct order table' })
       }
       else{
           res.send({success : "Delete Success"});
       }
    })
});

router.delete('/delete-direct-order/:id', (req, res) => {
    var order_id = req.params.id;
    let sql = "DELETE FROM direct_order WHERE order_id =" + mysql.escape(order_id);
    mysqlConnection.query(sql, (err, result) => {
       if(err){
           console.log(err);
           res.status(500).send({ error: 'Error in deleting a direct_order' })
       }
       else{
           res.send({success : "Delete Success"});
       }
    })
});


router.get('/all-direct-orders', (req,res) =>{
    let sql = "SELECT * FROM direct_order LEFT JOIN user ON direct_order.user_id = user.user_id LEFT JOIN address ON address.user_id = user.user_id"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching all direct orders' })
        }
        else{
            res.send(result);
        }
    });
});



 module.exports = router;
