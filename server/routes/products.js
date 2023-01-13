const express = require("express");
// const { requireAuth } = require('./middleware');
const { Product } = require("../database/schemas");
const getImage = require("../api/getEtsy");
const router = express.Router();

module.exports = router;

// full path is api/products

router.get("/product/:product", async (req, res) => {
  const productID = req.params.product;
  if (isNaN(productID)) {
    res.send({ error: "Not a valid ID" });
  }
  // used _ID component
  const product = await Product.findOne({ productId: productID });
  if (product) {
    if (product?.website === "Etsy") {
      const imageURL = await getImage(product.listingId);
      product.directImageSrc = imageURL;
    }
    res.send({ message: "Specific Product retrieved successfully", product });
  } else {
    res.send({ error: "No product found" });
  }
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

router.get("/etsy/:id", async (req, res) => {
  const listingId = req.params.id;
  try {
    const product = await getImage(listingId);
    res.send(product);
  } catch {
    res.status(404);
    res.send({ error: "Etsy name error" });
  }
});
