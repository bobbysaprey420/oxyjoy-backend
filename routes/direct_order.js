var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')




// create medicine table
router.get('/create-direct-order-table', (req, res) => {
    let sql = "CREATE TABLE direct_order(order_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id VARCHAR(1024) NOT NULL,imagefile_refernce VARCHAR(1000) NOT NULL ,address_id INT NOT NULL, status VARCHAR(1000) DEFAULT 'NOT CONFIRMED', insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (address_id) REFERENCES address(address_id))"
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

     if(!user_id){
        res.status(500).send({ error: 'User Id cannot be null' });
     }
     else{
         var value    = [[user_id, address_id,imagefile_refernce]];
         let sql = "INSERT INTO direct_order(user_id, address_id,imagefile_refernce) VALUES ?"
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
           res.status(500).send({ error: 'Error in deleting a medicine from cart' })
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
