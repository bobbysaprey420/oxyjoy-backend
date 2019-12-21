var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './direct_uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png'){
        cb(null, true)
    }
    else{
        cb(null , false)
    }
}
const upload = multer({ storage : storage, fileFilter : fileFilter});



// create medicine table
router.get('/create-direct-order-table', (req, res) => {
    let sql = "CREATE TABLE direct_order(order_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT, user_id INT NOT NULL, address_id INT NOT NULL, status VARCHAR(1000) DEFAULT 'NOT CONFIRMED', image_url VARCHAR(8000), insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (address_id) REFERENCES address(address_id))"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in creating direct order table' })
        }
        else
        res.send(result);
        })
 });

 router.post('/post-direct-order', upload.single('productImage'), (req, res) => {
     const user_id = req.body.user_id;
     const address_id = req.body.address_id;
     var path = req.file.path;
     var path2 ="direct_uploads/" + path.substr(8, path.length);

     if(!user_id){
        res.status(500).send({ error: 'User Id cannot be null' });
     }
     else{
         var value    = [[user_id, address_id, path2]];
         let sql = "INSERT INTO direct_order(user_id, address_id, image_url) VALUES ?"
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

 router.post('/update-direct-order-status', (req, res) =>{
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
           res.status(500).send({ error: 'Error in deleting a medicine from cart' })
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



 module.exports = router;