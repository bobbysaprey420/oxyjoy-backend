var express = require("express");
var router = express.Router();
const mysql = require('mysql');
var mysqlConnection = require('../../connection')

// create product table
router.get('/create-product', (req, res) => {
    let sql = "CREATE TABLE product(product_id INT(11) AUTO_INCREMENT PRIMARY KEY, product_name TEXT NOT NULL, product_discription TEXT, product_price_MRP float, discount_percentage float, product_image text, GST_percentage float, product_type_id int, medicine_type_id int, company_medicine_id int, generic boolean DEFAULT false, medicine_branch_id int, prescription_required boolean DEFAULT false, subcategory_id int, manufacturer_id int, brand_name_id int, FOREIGN KEY (product_type_id) REFERENCES product_type(product_type_id), FOREIGN KEY (medicine_type_id) REFERENCES medicine_type(medicine_type_id), FOREIGN KEY (company_medicine_id) REFERENCES company_medicine(company_medicine_id), FOREIGN KEY (medicine_branch_id) REFERENCES medicine_branch(medicine_branch_id), FOREIGN KEY (subcategory_id) REFERENCES subcategory(subcategory_id), FOREIGN KEY (manufacturer_id) REFERENCES manufacturer(manufacturer_id),  FOREIGN KEY (brand_name_id) REFERENCES brand_name(brand_name_id))"
    mysqlConnection.query(sql, (err, result) => {
      if(err){
        res.status(500).send({ error : "Error in creating table", message : err})
      }
      else{
        res.send(result);
      }
    })
 });


 // insert product in the product by making a post request
 router.post('/insert-product', (req, res) => {
   console.log(req.body)
  var product_name           = req.body.product_name;
  var product_discription    = req.body.product_discription   || null;
  var product_price_MRP      = req.body.product_price_MRP     || null;
  var discount_percentage    = req.body.discount_percentage   || null;
  var product_image          = req.body.product_image         || null;
  var GST_percentage         = req.body.GST_percentage        || null;
  var product_type_id        = req.body.product_type_id       || null;
  var medicine_type_id       = req.body.medicine_type_id      || null;
  var company_medicine_id    = req.body.company_medicine_id   || null;
  var generic                = req.body.generic               || 0;
  var medicine_branch_id     = req.body.medicine_branch_id    || null;
  var prescription_required  = req.body.prescription_required || 0;
  var subcategory_id         = req.body.subcategory_id        || null;
  var manufacturer_id        = req.body.manufacturer_id       || null;
  var brand_name_id          = req.body.brand_name_id         || null;

  if(!product_name){
    console.log("Invalid insert, product name filed cannot be empty");
    res.status(500).send({ error: 'Compolsary filed cannot be empty' })
  }
  else{
    var value    = [[product_name, product_discription, product_price_MRP, discount_percentage, product_image, GST_percentage, product_type_id, medicine_type_id, company_medicine_id, generic, medicine_branch_id, prescription_required, subcategory_id, manufacturer_id, brand_name_id]];
    let sql = "INSERT INTO product (product_name, product_discription, product_price_MRP, discount_percentage, product_image, GST_percentage, product_type_id, medicine_type_id, company_medicine_id, generic, medicine_branch_id, prescription_required, subcategory_id, manufacturer_id, brand_name_id) VALUES ?"
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

// Fetch the entire table of the product
router.get('/fetch-products', (req, res) => {
  let sql = "SELECT * FROM product"
  mysqlConnection.query(sql , (err, result) => {
    if(err){
      res.status(500).send({ error : "Error in fetching all products", message : err})
    }
    else{
      res.send(result);
    }
    })
});

// Fetch a particular product from the product table
router.get('/fetch-product/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product WHERE product_id="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a product", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// Fetch a particular product from the product table by product type id
router.get('/fetch-product-by-productType/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product WHERE product_type_id ="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a product via product type id", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// Fetch a particular product from the product table by medicine type id
router.get('/fetch-product-by-medicineType/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product WHERE medicine_type_id ="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a product via medicine type id", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// Fetch a particular product from the product table by company medicine id
router.get('/fetch-product-by-compMedicine/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product WHERE company_medicine_id ="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a product via company medicine id", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// Fetch a particular product from the product table by medicine branch id
router.get('/fetch-product-by-medicineBranch/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product WHERE medicine_branch_id ="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a product via medicine branch id", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// Fetch a particular product from the product table by subcategory id
router.get('/fetch-product-by-subcategory/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product WHERE subcategory_id ="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a product via subcategory id", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// Fetch a particular product from the product table by manufacturer id
router.get('/fetch-product-by-manufacturer/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product WHERE manufacturer_id ="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a product via manufacturer id", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// Fetch a particular product from the product table by brand name id
router.get('/fetch-product-by-brandName/:id', function(req, res) {
  var id = req.params.id;
  var sql = "SELECT * FROM product WHERE brand_name_id ="  + mysql.escape(id);
  mysqlConnection.query(sql, function(err, result) {
    if(err){
      res.status(500).send({ error : "Error in fetching a product via brand name id", message : err})
    }
    else{
      res.send(result);
    }
  })
});

// update the product from the table
router.put('/update-product/:id', function(req, res) {

  var error = []
   if(req.body.product_name){
    let sql = "UPDATE product SET product_name=" +mysql.escape(req.body.product_name) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.product_discription){
    let sql = "UPDATE product SET product_discription=" +mysql.escape(req.body.product_discription) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.product_price_MRP){
    let sql = "UPDATE product SET product_price_MRP=" +mysql.escape(req.body.product_price_MRP) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.discount_percentage){
    let sql = "UPDATE product SET discount_percentage=" +mysql.escape(req.body.discount_percentage) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.product_image){
    let sql = "UPDATE product SET product_image=" +mysql.escape(req.body.product_image) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.GST_percentage){
    let sql = "UPDATE product SET GST_percentage=" +mysql.escape(req.body.GST_percentage) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.product_type_id){
    let sql = "UPDATE product SET product_type_id=" +mysql.escape(req.body.product_type_id) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.medicine_type_id){
    let sql = "UPDATE product SET medicine_type_id=" +mysql.escape(req.body.medicine_type_id) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.company_medicine_id){
    let sql = "UPDATE product SET company_medicine_id=" +mysql.escape(req.body.company_medicine_id) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
   }
   if(req.body.generic){
    let sql = "UPDATE product SET generic=" +mysql.escape(req.body.generic) + " WHERE product_id=" + mysql.escape(req.params.id);
    mysqlConnection.query(sql, (err, result) => {
       if(err) {
           console.log(err);
           error.push(err)
       }
    })
  }
  if(req.body.medicine_branch_id){
   let sql = "UPDATE product SET medicine_branch_id=" +mysql.escape(req.body.medicine_branch_id) + " WHERE product_id=" + mysql.escape(req.params.id);
   mysqlConnection.query(sql, (err, result) => {
      if(err) {
          console.log(err);
          error.push(err)
      }
   })
  }
  if(req.body.prescription_required){
   let sql = "UPDATE product SET prescription_required=" +mysql.escape(req.body.prescription_required) + " WHERE product_id=" + mysql.escape(req.params.id);
   mysqlConnection.query(sql, (err, result) => {
      if(err) {
          console.log(err);
          error.push(err)
      }
   })
  }
  if(req.body.subcategory_id){
   let sql = "UPDATE product SET subcategory_id=" +mysql.escape(req.body.subcategory_id) + " WHERE product_id=" + mysql.escape(req.params.id);
   mysqlConnection.query(sql, (err, result) => {
      if(err) {
          console.log(err);
          error.push(err)
      }
   })
  }
  if(req.body.manufacturer_id){
   let sql = "UPDATE product SET manufacturer_id=" +mysql.escape(req.body.manufacturer_id) + " WHERE product_id=" + mysql.escape(req.params.id);
   mysqlConnection.query(sql, (err, result) => {
      if(err) {
          console.log(err);
          error.push(err)
      }
   })
  }
  if(req.body.brand_name_id){
   let sql = "UPDATE product SET brand_name_id=" +mysql.escape(req.body.brand_name_id) + " WHERE product_id=" + mysql.escape(req.params.id);
   mysqlConnection.query(sql, (err, result) => {
      if(err) {
          console.log(err);
          error.push(err)
      }
   })
  }

   if(error.length == 0)
   res.send({success: 'Updating the product table is successful'});
   else
   res.send({error : error});
});

// delete a particular product from the table
router.delete('/delete-product/:id', function(req, res, next) {
  var id = req.params.id;
  var sql = "DELETE FROM product WHERE product_id=" + mysql.escape(id);
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
