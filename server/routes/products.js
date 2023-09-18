const express = require("express");
const getImage = require("../api/getEtsy");
const router = express.Router();
const pool = require("../dataBaseSQL/db");

// full path is api/products

router.get("/product/:product", async (req, res) => {
  const productID = req.params.product;
  if (isNaN(productID)) {
    res.send({ error: "Not a valid ID" });
    return;
  }

  try {
    const client = await pool.connect();
    const query = "SELECT * FROM products WHERE product_id = $1";
    const result = await client.query(query, [productID]);
    client.release();

    const product = result.rows[0];
    if (product) {
      if (product.website === "Etsy") {
        const imageURL = await getImage(product.listing_id);
        product.direct_image_src = imageURL;
      }
      res.send({ message: "Specific Product retrieved successfully", product });
    } else {
      res.send({ error: "No product found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error retrieving product");
  }
});

router.get("/category/:name", async (req, res) => {
  const category = req.params.name;
  try {
    const client = await pool.connect();
    const query = "SELECT * FROM products WHERE category = $1";
    const result = await client.query(query, [category]);
    client.release();

    res.send(result.rows);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error retrieving products by category");
  }
});

router.post("/add_product", async (req, res) => {
  const newProduct = req.body;

  try {
    const client = await pool.connect();
    const query =
      "INSERT INTO products (productname, category) VALUES ($1, $2) RETURNING *";
    const values = [newProduct.productName, newProduct.category];
    const result = await client.query(query, values);
    client.release();

    const insertedProduct = result.rows[0];
    res.send({
      message: "Product added successfully",
      newProduct: insertedProduct,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error adding product");
  }
});

router.get("/etsy/:id", async (req, res) => {
  const listingId = req.params.id;
  try {
    const product = await getImage(listingId);
    res.send(product);
  } catch {
    res.status(404).send({ error: "Etsy name error" });
  }
});

module.exports = router;
