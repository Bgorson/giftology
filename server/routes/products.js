const express = require("express");
const getImage = require("../api/getEtsy");
const router = express.Router();
const pool = require("../dataBaseSQL/db");
const jwt = require("jsonwebtoken");
const addProduct = require("../utils/addProduct");

const joinProductQuery = `SELECT
p.product_id,
p.product_name,
p.*,
ARRAY_AGG(DISTINCT cl.category_name) AS category,
ARRAY_AGG(DISTINCT gl.gift_type_name) AS gift_type,
ARRAY_AGG(DISTINCT ol.occassion_name) AS occasion,
ARRAY_AGG(DISTINCT tl.tag_name) AS tags,
ARRAY_AGG(DISTINCT CASE WHEN t.display_on_card = true THEN tl.tag_name ELSE NULL END) AS tags_display,
ARRAY_AGG(DISTINCT CASE WHEN t.use_in_calculating = true THEN tl.tag_name ELSE NULL END) AS tags_sort

FROM
products AS p
LEFT JOIN
categories AS c ON p.product_id = c.product_id
LEFT JOIN
categories_list AS cl ON c.category_id = cl.id
LEFT JOIN
gift_type AS gt ON p.product_id = gt.product_id
LEFT JOIN
gift_type_list AS gl ON gt.gift_type_id = gl.id
LEFT JOIN
occasion AS o ON p.product_id = o.product_id
LEFT JOIN
occasion_list AS ol ON o.occasion_id = ol.id
LEFT JOIN
tags AS t ON p.product_id = t.product_id
LEFT JOIN
tag_list AS tl ON t.tag_id  = tl.id  
WHERE p.product_id = $1
GROUP BY
p.product_id, p.product_name;
`;
function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];

  if (typeof bearerHeader !== "undefined") {
    const bearerToken = bearerHeader.split(" ")[1];

    req.token = bearerToken;

    next();
  } else {
    res.sendStatus(403);
  }
}
// full path is api/products

router.get("/product/:product", async (req, res) => {
  const productID = req.params.product;
  if (isNaN(productID)) {
    res.send({ error: "Not a valid ID" });
    return;
  }

  try {
    const client = await pool.connect();
    const query = joinProductQuery;
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

router.post("/add_product", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err || authData === undefined) {
      res.sendStatus(403);
    } else {
      try {
        const { _id } = authData;
        const client = await pool.connect();

        const userQuery = "SELECT * FROM users WHERE email = $1";
        const userResult = await client.query(userQuery, [_id]);
        const isAdmin = userResult.rows[0].is_admin;
        const product = req.body;
        if (isAdmin) {
          await addProduct({ product, userAdded: true });
          res.sendStatus(200);
        } else {
          res.sendStatus(403);
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error retrieving user");
      }
    }
  });
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
