
var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../connection')
const multer = require('multer');
var cors = require('cors')
router.use(cors());

// create medicine table
router.get('/create-cart-table', (req, res) => {
    let sql = "CREATE TABLE cart(user_id VARCHAR(1024) NOT NULL, medicine_id INT(11) NOT NULL, quantity INT NOT NULL, insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id) ON DELETE CASCADE)"
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
     let sql = "SELECT * FROM cart LEFT JOIN medicine ON cart.medicine_id = medicine.medicine_id WHERE user_id ="+  mysql.escape(req.params.id);
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
    let sql = "CREATE TABLE orders(order_id INT AUTO_INCREMENT PRIMARY KEY, user_id VARCHAR(1024) NOT NULL, address_id INT NOT NULL, imagefile_refernce VARCHAR(1000) NOT NULL, amount FLOAT DEFAULT 0, bill_pdf VARCHAR(256), delivery_date DATE, description VARCHAR(256), status_code int default 0,  status_message VARCHAR(1000) DEFAULT 'NOT CONFIRMED', status_description VARCHAR(1000), tracking_id varchar(256), insert_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES user(user_id), FOREIGN KEY (address_id) REFERENCES address(address_id) ON DELETE CASCADE)"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in creating order table' })
        }
        else
        res.send(result);
    })
});

//get order by order_id join by user table by users table and join by address table by address_id
router.get('/all-order-user-address', (req,res) =>{
    let sql = "SELECT * FROM orders INNER JOIN user ON orders.user_id = user.user_id INNER JOIN address ON address.address_id = orders.address_id"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching all direct orders' })
        }
        else{
            res.send(result);
        }
    });
});

//get order by order id in cartorder table
router.get('/all-order-byorderid/:id', (req,res) => {
    var user_id = req.params.id;
    let sql = "SELECT * FROM orders WHERE order_id =" + mysql.escape(user_id);
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching orders from order table by orderid' })
        }
        else{
            res.send(result);
        }
    })
});

router.get('/create-order-product-table', (req, res) => {
    let sql = "CREATE TABLE order_product(order_id INT NOT NULL, medicine_id INT(11) NOT NULL, quantity INT NOT NULL, FOREIGN KEY (order_id) REFERENCES orders(order_id), FOREIGN KEY (medicine_id) REFERENCES medicine(medicine_id))"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({ error: 'Error in creating order product table' })
        }
        else
        res.send(result);
    })
});

//get order product by order id inner join by product table on product_is(or medicine_id)
router.get('/all-order-product', (req,res) =>{
    let sql = "SELECT * FROM order_product INNER JOIN product ON order_product.order_id = product.product_id"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching all direct orders' })
        }
        else{
            res.send(result);
        }
    });
});


router.post('/submit-order', (req,res) => {
    var user_id = req.body.user_id;
    const address_id = req.body.address_id;
    var order_id = null
    if(!user_id){
       res.status(500).send({ error: 'User Id cannot be null' });
    }
    else{
        var value    = [[user_id, address_id]];
        let sql = "INSERT INTO orders (user_id, address_id) VALUES ?"
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

router.post('/post-orders', (req, res) => {
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
        let sql = "INSERT INTO orders(user_id, address_id,imagefile_refernce,amount,bill_pdf,description,status_code,status_message,status_description,tracking_id) VALUES ?"
        mysqlConnection.query(sql, [value] , (err, result) => {
            if(err){
                res.status(500).send({ error: 'Error in inserting' })
            }
            else
            res.send({ success : "Success"});
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

router.get('/all-orders', (req,res) =>{
    let sql = "SELECT * FROM orders"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching all orders' })
        }
        else{
            res.send(result);
        }
    });
});


router.get('/allorder-product-details', (req, res) =>{
    let sql = "SELECT * FROM order_product LEFT JOIN medicine ON order_product.medicine_id = medicine.medicine_id"
    mysqlConnection.query(sql, (err, result) => {
        if(err){
            res.status(500).send({ error: 'Error in fetching all orders product detail' })
        }
        else{
            res.send(result);
        }
    });
})

router.put('/update-orders-status-code-message/:id', (req, res) =>{
  var error = []
   if(req.body.status_code){
    let sql = "UPDATE orders SET status_code=" +mysql.escape(req.body.status_code) + " WHERE order_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.status_message){
    let sql = "UPDATE orders SET status_message=" +mysql.escape(req.body.status_message) + " WHERE order_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(req.body.status_description){
    let sql = "UPDATE orders SET status_description=" +mysql.escape(req.body.status_description) + " WHERE order_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(req.body.bill_pdf){
    let sql = "UPDATE orders SET bill_pdf=" +mysql.escape(req.body.bill_pdf) + " WHERE order_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.amount){
    let sql = "UPDATE orders SET amount=" +mysql.escape(req.body.amount) + " WHERE order_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.description){
    let sql = "UPDATE orders SET description=" +mysql.escape(req.body.description) + " WHERE order_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.tracking_id){
    let sql = "UPDATE orders SET tracking_id=" +mysql.escape(req.body.tracking_id) + " WHERE order_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }

   if(error.length == 0)
   res.send({success: 'Updating the orders status-code or status-message table is successful'});
   else
   res.send({error : error});
});

router.delete('/delete-orders-byorder_id/:id', (req, res) => {
    var order_id = req.params.id;
    let sql = "DELETE FROM order_product WHERE order_id =" + mysql.escape(order_id);
    mysqlConnection.query(sql, (err, result) => {
       if(err){
           console.log(err);
           res.status(500).send({ error: 'Error in deleting a order from a order_product' })
       }
       else{
         let sql1 = "DELETE FROM orders WHERE order_id =" + mysql.escape(order_id);
         mysqlConnection.query(sql1, (err1, result1) => {
            if(err1){
              console.log(err1);
              res.status(500).send({ error: 'Error in deleting a order from a order_id' })
          }
          else{
              res.send({success : "Delete Success"});
          }
       })
    }
})
});


/*
 router.get('/direct-order-asd1234', (req, res) => {
    var name =
}) */




 module.exports = router;
