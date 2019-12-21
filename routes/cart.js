var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads/');
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
router.get('/create-cart-table', (req, res) => {
    let sql = "CREATE TABLE cart(user_id INT NOT NULL, medicine_id INT NOT NULL, quantity INT NOT NULL, insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id))"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in creating cart table' })
        }
        else
        res.send(result);
        })
 });

router.post('/insert-medicine-cart', (req,res) => {
     var user_id = req.body.user_id;
     var medicine_id = req.body.medicine_id;
     if(!medicine_id || !user_id){
        res.status(500).send({ error: 'User Id or medicine id cannot be null' });
     }
     else{
        let sql = "SELECT * FROM cart WHERE medicine_id="  + mysql.escape(medicine_id) + " AND user_id=" + mysql.escape(user_id);
        mysqlConnection.query(sql, (err, row, fields) => {
           if(err){
               console.log(err);
               res.status(500).send({ error: 'Error occured' })
           }
           else if(row.length > 0){
               let sql2 = "UPDATE cart SET quantity="+mysql.escape(req.body.quantity) + " WHERE medicine_id=" + mysql.escape(medicine_id) + " AND user_id=" + mysql.escape(user_id);
               mysqlConnection.query(sql2, (err, result) => {
                   if(err){
                       console.log(err);
                       res.status(500).send({ error: 'Cannot update quantity of given medicine' })
                   }
                   res.send({'status': 'success'})
               })
           }
           else{
               values = [[user_id, medicine_id, req.body.quantity]]
               let sql3 = "INSERT INTO cart(user_id, medicine_id, quantity) VALUES ?"
               mysqlConnection.query(sql3, [values] , (err, result) => {
                   if(err){
                       console.log(err);
                       res.status(500).send({ error: 'Cannot insert the given medicine into cart' })
                   }
                   else
                   res.send(result);
                 })
           }
           })
     }
 });

router.get('/get-user-cart/:id', (req,res) => {
     let sql = "SELECT * FROM cart WHERE user_id =" + mysql.escape(req.params.id);
     mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in fetching cart of a particular user' })
        }
        else if(result.length == 0 )
        res.status(500).send({ error: 'No matched row' });
        else{
            res.send(result);
        }
        })
});

router.delete('/delete-item-cart/:user_id/:medicine_id', (req, res) => {
     let sql = "DELETE FROM cart WHERE user_id =" + mysql.escape(req.params.user_id) + " AND medicine_id =" + mysql.escape(req.params.medicine_id);
     mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in deleting a medicine from cart' })
        }
        else{
            res.send({success : "Success"});
        }
     })
});



router.get('/create-order-table', (req, res) => {
    let sql = "CREATE TABLE orders(order_id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, status VARCHAR(128) DEFAULT 'NOT CONFIRMED', image_url VARCHAR(8000) NOT NULL, insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES user(user_id))"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in creating order table' })
        }
        else
        res.send(result);
    })
});

router.get('/alter-order-table', (req, res) =>{
    let sql = "ALTER TABLE orders ADD COLUMN image_url VARCHAR(8000) NOT NULL AFTER status"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in altering order table' })
        }
        else
        res.send({success : "success"});
    })
})

router.get('/create-order-product-table', (req, res) => {
    let sql = "CREATE TABLE order_product(order_id INT NOT NULL, medicine_id INT NOT NULL, quantity INT NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(order_id), FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id))"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in creating order product table' })
        }
        else
        res.send(result);
    })
});

router.post('/submit-order', upload.single('productImage'), (req,res) => {
    var user_id = req.body.user_id;
    console.log(req.file)
    var path = req.file.path;
    var path2 ="uploads/" + path.substr(8, path.length);
    var order_id = null
    if(!user_id){
       res.status(500).send({ error: 'User Id cannot be null' });
    }
    else{
        var value    = [[user_id, path2]];
        let sql = "INSERT INTO orders (user_id, image_url) VALUES ?"
        mysqlConnection.query(sql, [value] , (err, result) => {
            if(err){
                res.status(500).send({ error: 'Error in inserting' })
            }
            else{
                let sql5 = "SELECT LAST_INSERT_ID();"
                mysqlConnection.query(sql5, (err5, result5) => {
                    if(err5){
                        console.log(err5);
                        res.status(500).send({ error: 'Error in submiting order of a user' })
                    }
                    else{
                        order_id = Object.values(JSON.parse(JSON.stringify(result5[0])))[0];
                        let sql2 = "SELECT medicine_id, quantity FROM cart WHERE user_id=" + mysql.escape(user_id);
                        mysqlConnection.query(sql2, (err2, result2) => {
                            if(err2){
                                res.status(500).send({ error: 'Error in fetching cart of a particular user' })
                            }
                            else{
                                if(result2.length != 0){
                                    data = []
                                    result2.forEach(element => {
                                        row = [order_id, element.medicine_id, element.quantity]
                                        data.push(row)
                                    });
                                    let sql3 = "INSERT INTO order_product (order_id, medicine_id, quantity) VALUES ?"
                                    mysqlConnection.query(sql3, [data] , (err3, result3) => {
                                        if(err3){
                                            console.log(err3);
                                            res.status(500).send({ error: 'Error in inserting' })
                                        }
                                        else{
                                            let sql4 = "DELETE FROM cart WHERE user_id =" + mysql.escape(user_id);
                                            mysqlConnection.query(sql4, (err4, result4) => {
                                                if(err4){
                                                    console.log(err4);
                                                    res.status(500).send({ error: 'Error in deleting a cart of a user' })
                                                }
                                                else{
                                                    let sql6= "SELECT * FROM order_product WHERE order_id =" + mysql.escape(order_id);
                                                    mysqlConnection.query(sql6, (err6, result6) => {
                                                        if(err6){
                                                            console.log(err6);
                                                            res.status(500).send({ error: 'Error in fetching order details' })
                                                        }
                                                        else
                                                        res.send({success : "Success", res : result6});
                                                    });
                                                }
                                            })
                                        }
                                    })
                                }
                                else {
                                    let sql7= "DELETE FROM orders WHERE order_id=" + mysql.escape(order_id);
                                    mysqlConnection.query(sql7, (err7, result7) => {
                                        if(err7){
                                            res.status(500).send({ error: 'Error in deleting order when cart is empty' })
                                        }
                                        else
                                        res.status(500).send({info : 'Cart is empty'});
                                    })
                                }
                            }
                        })
                    }
                })
            }
        })
    }
});

router.get('/all-order-details-user/:id', (req,res) =>{
    var user_id = req.params.id;
    let sql = "SELECT * FROM orders WHERE user_id = " + mysql.escape(user_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching all order ids from a user' })
        }
        else{
            arr = []
            result.forEach(prod => {
                arr.push(prod.order_id)
            });
            let sql2 = "SELECT * FROM order_product WHERE order_id IN (" + arr.join() + ")";
            mysqlConnection.query(sql2, (err2, result2) => {
                if(err2){
                    res.status(500).send({ error: 'Error in fetching all orders details from a user' })
                }
                else{
                    res.send({order_ids : result, details : result2 });
                }
            })
        }
        
    })
})

router.get('/update-order-status/:status/:id', (req, res) =>{
    var status = req.params.status;
    var order_id = req.params.id;
    let sql = "UPDATE orders SET status =" + mysql.escape(status) + " WHERE order_id = " + mysql.escape(order_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching all orders details from a user' })
        }
        else{
            res.send({ result : "success" });
        }
    })
});

router.get('/all-order-status/:id', (req,res) => {
    var user_id = req.params.id;
    let sql = "SELECT order_id, status FROM orders WHERE user_id =" + mysql.escape(user_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching status from a user' })
        }
        else{
            res.send(result);
        }
    })
});

router.get('/order-status/:id', (req,res) => {
    var order_id = req.params.id;
    let sql = "SELECT order_id, status FROM orders WHERE order_id =" + mysql.escape(order_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching status from a user' })
        }
        else{
            res.send(result);
        }
    })
});

router.get('/order-details/:id', (req,res) => {
    var order_id = req.params.id;
    let sql = "SELECT * FROM order_product WHERE order_id =" + mysql.escape(order_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching order details from a user of a particular order' })
        }
        else{
            res.send(result);
        }
    })
});

router.get('/prescription-image/:id', (req,res) => {
    var order_id = req.params.id;
    let sql = "SELECT image_url FROM orders WHERE order_id ="+ mysql.escape(order_id)
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching prscription photo of a order' })
        }
        else{
            res.redirect('/' + result[0].image_url);
        }
    })
});

/* router.get('/direct-order-asd1234', (req, res) => {
    var name = 
}) */




 module.exports = router;