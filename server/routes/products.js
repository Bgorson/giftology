const express = require("express");
// const { requireAuth } = require('./middleware');
const { Product } = require("../database/schemas");

const router = express.Router();

module.exports = router;

// full path is api/product
router.get("/", async (req, res) => {
  const products = await Product.find({});

  res.send({ message: "Product retrieved successfully", products });
});

router.get("/category/:name", async (req, res) => {
  const category = req.params.name;
  try {
    const categoryRes = await Product.find({ Category: category });
    res.send(categoryRes);
  } catch {
    res.status(404);
    res.send({ error: "Category name error" });
  }
});

router.post("/add_product", async (request, response) => {
  const newProduct = new Product(request.body);

  await newProduct.save();
  response.send({ message: "Product added successfully", newProduct });
});
