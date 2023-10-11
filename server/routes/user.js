const express = require("express");
const router = express.Router();
const pool = require("../dataBaseSQL/db");

const getImage = require("../api/getEtsy");

const jwt = require("jsonwebtoken");
module.exports = router;
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
WHERE p.product_id = ANY($1::int[])
GROUP BY
p.product_id, p.product_name;
`
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

router.get("/", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const client = await pool.connect();
      try {
        const query = "SELECT * FROM users WHERE email = $1";
        const result = await client.query(query, [_id]);
        const user = result.rows[0];
        res.send(user);
      } catch (error) {
        console.error("Error fetching user:", error);
        res.sendStatus(500);
      } finally {
        client.release();
      }
    }
  });
});

// router.get("/favorites", verifyToken, async (req, res) => {
//   jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
//     if (err) {
//       console.log("ERROR", err);
//       res.sendStatus(403);
//     } else {
//       const { _id } = authData;
//       const client = await pool.connect();
//       try {
//         const userQuery = "SELECT * FROM users WHERE email = $1";
//         const userResult = await client.query(userQuery, [_id]);
//         const user = userResult.rows[0];

//         const findProductArray = JSON.parse(user.user_data).filter(
//           (wishlist) => wishlist.id === req.query.quizId
//         );
//         const productIds = findProductArray[0].wishlist;

//         const productQuery = joinProductQuery
//         const productResult = await client.query(productQuery, [productIds]);
//         const matchingProducts = productResult.rows;

//         const updatedProducts = await Promise.all(
//           matchingProducts.map(async (product) => {
//             if (product.website === "Etsy") {
//               product.direct_image_src = await getImage(product.listing_id);
//             }
//             return product;
//           })
//         );

//         res.send(updatedProducts);
//       } catch (error) {
//         console.error("Error fetching favorites:", error);
//         res.sendStatus(500);
//       } finally {
//         client.release();
//       }
//     }
//   });
// });

router.get("/favorites", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const client = await pool.connect();
      try {
        const userQuery = "SELECT id FROM users WHERE email = $1";
        const userResult = await client.query(userQuery, [_id]);
        const user = userResult.rows[0].id;
        const findAllFavorites = `SELECT product_id FROM favorites WHERE user_id = $1`;
        const findAllFavoritesResult = await client.query(findAllFavorites, [user]);
        const arrayOfProductIds = findAllFavoritesResult.rows.map((item) => item.product_id);
        const productQuery = joinProductQuery
        const productResult = await client.query(productQuery, [arrayOfProductIds]);
        const matchingProducts = productResult.rows;
        const updatedProducts = await Promise.all(
          matchingProducts.map(async (product) => {
            if (product.website === "Etsy") {
              product.direct_image_src = await getImage(product.listing_id);
            }
            return product;
          })
        );

        res.send(updatedProducts);
      } catch (error) {
        console.error("Error fetching favorites:", error);
        res.sendStatus(500);
      } finally {
        client.release();
      }
    }
  });
});


router.post("/favorites", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const client = await pool.connect();
      try {
        const user = await client.query(
          "SELECT id FROM users WHERE email = $1",
          [_id]
        );
        let userData = user.rows[0].id || null; // Default to empty array if null
if (!userData) return res.sendStatus(500)
        const quizId = req.body.quizId;
        const product = req.body.product.product_id;
          const postFavoriteQuery = `INSERT INTO favorites (user_id, product_id, quiz_id) VALUES ($1, $2, $3)`;
          const postFavoriteValues = [parseInt(userData), product, quizId];
          await client.query(postFavoriteQuery, postFavoriteValues);


        res.status(200).json({ message: "Updated wishlist" });
      } catch (error) {
        console.error("Error updating favorites:", error);
        res.sendStatus(500);
      } finally {
        client.release();
      }
    }
  });
});


router.delete("/favorites", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    }
    const { _id } = authData;
    const client = await pool.connect();
    try {
      const user = await client.query(
        "SELECT id FROM users WHERE email = $1",
        [_id]
      );
      let userData = user.rows[0].id || null; // Default to empty array if null
      if (!userData) return res.sendStatus(500);
      const quizId = req.body.quizId;
      const product = req.body.product.product_id;
      const deleteFavoriteQuery = `DELETE FROM favorites WHERE user_id = $1 AND product_id = $2 AND quiz_id = $3`;
      const deleteFavoriteValues = [parseInt(userData), product, quizId];
      await client.query(deleteFavoriteQuery, deleteFavoriteValues);

      res.status(200).json({ message: "Updated wishlist" });
    } catch (error) {
      console.error("Error updating favorites:", error);
      res.sendStatus(500);
    } finally {
      client.release();
    }
  });
});

router.delete("/profile", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const client = await pool.connect();
      try {
        const userQuery = "SELECT * FROM users WHERE email = $1";
        const userResult = await client.query(userQuery, [_id]);
        const user = userResult.rows[0];

        const profileId = req.body.id;
        user.user_data = JSON.parse(user.user_data).filter(
          (item) => item.id !== profileId
        );

        const updateUserQuery =
          "UPDATE users SET user_data = $1 WHERE email = $2";
        await client.query(updateUserQuery, [
          JSON.stringify(user.user_data),
          _id,
        ]);

        res.send(user);
      } catch (error) {
        console.error("Error deleting profile:", error);
        res.sendStatus(500);
      } finally {
        client.release();
      }
    }
  });
});

router.patch("/profile", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const client = await pool.connect();
      try {
        const userQuery = "SELECT * FROM users WHERE email = $1";
        const userResult = await client.query(userQuery, [_id]);
        let user = userResult.rows[0];

        const { id, url } = req.body;
        const profileIndex = JSON.parse(user.user_data).findIndex(
          (item) => item.id === id
        );
        let newValue = JSON.parse(user.user_data)[profileIndex].quizResults;
        newValue.createAccount = url;
        user.user_data = JSON.parse(user.user_data).map((item) =>
          item.id === id ? { ...item, quizResults: newValue } : item
        );
        const updateUserQuery =
          "UPDATE users SET user_data = $1 WHERE email = $2";
        await client.query(updateUserQuery, [
          JSON.stringify(user.user_data),
          _id,
        ]);

        res.send(user);
      } catch (error) {
        console.error("Error updating profile:", error);
        res.sendStatus(500);
      } finally {
        client.release();
      }
    }
  });
});

router.post("/mailingList", (req, res) => {
  const { userName, email } = req.body;

  // Check if the user already exists in the database
  const checkUserQuery = `SELECT * FROM users WHERE email = ?`;

  // Insert a new user into the database
  const insertUserQuery = `INSERT INTO users (name, email, mailingList) VALUES (?, ?, true)`;

  // Execute the queries
  client.query(checkUserQuery, [email], (err, rows) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong",
      });
    } else {
      // If the user already exists, return a message
      if (rows.length > 0) {
        res.json({ message: "User already exists" });
      } else {
        // If the user doesn't exist, insert them into the database
        db.query(insertUserQuery, [userName, email], (err, result) => {
          if (err) {
            return res.status(400).json({
              error: "Something went wrong",
            });
          }

          res.json({ message: "User added" });
        });
      }
    }
  });

  // Receive Full name and Email.
  // Check if user already exists in the database.
  // If user already exists, return a message.
  // If user doesn't exist, insert them into the database.
});

router.post("/behavior", verifyToken, async (req, res) => {

      const _id = req.body.userId;
      const client = await pool.connect();
      try {
        const userQuery = "SELECT * FROM users WHERE email = $1";
        const userResult = await client.query(userQuery, [_id]);
        let user = userResult.rows[0]||{};
        const {behavior, product, quizId} = req.body;
        const userId = user.id||null;
        // check if record exists:
        const checkBehaviorQuery = `SELECT * FROM user_behaviors WHERE product_id = $1 AND quiz_id = $2`;
        const checkBehaviorResult = await client.query(checkBehaviorQuery, [product, quizId]);

        if (checkBehaviorResult.rows.length > 0) {

           let preExistingbehavior = checkBehaviorResult.rows[0];
           const favorite = preExistingbehavior.clicked_favorite|| behavior.clicked_favorite || false;
           const info = preExistingbehavior.clicked_info|| behavior.clicked_info || false;
           const retailer = preExistingbehavior.clicked_retailer|| behavior.clicked_retailer || false;
           const updateBehaviorQuery = `UPDATE user_behaviors SET clicked_favorite = $1, clicked_info = $2, clicked_retailer = $3 WHERE product_id = $4 AND quiz_id = $5`;
           await client.query(updateBehaviorQuery, [favorite, info, retailer, product, quizId]);
        } else {
          const insertBehaviorQuery = `INSERT INTO user_behaviors (clicked_favorite,clicked_info,clicked_retailer, product_id, quiz_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)`;
          await client.query(insertBehaviorQuery, [behavior.clicked_favorite||false, behavior.clicked_info||false, behavior.clicked_retailer||false, product, quizId, userId]);
        }
        res.sendStatus(200);

      } catch (error) {
        console.error("Error updating profile:", error);
        res.sendStatus(500);
      } finally {
        client.release();
      }
  });

    //     const { id, url } = req.body;
    //     const profileIndex = JSON.parse(user.user_data).findIndex(
    //       (item) => item.id === id
    //     );
    //     let newValue = JSON.parse(user.user_data)[profileIndex].quizResults;
    //     newValue.createAccount = url;
    //     user.user_data = JSON.parse(user.user_data).map((item) =>
    //       item.id === id ? { ...item, quizResults: newValue } : item
    //     );
    //     const updateUserQuery =
    //       "UPDATE users SET user_data = $1 WHERE email = $2";
    //     await client.query(updateUserQuery, [
    //       JSON.stringify(user.user_data),
    //       _id,
    //     ]);

    //     res.send(user);
    //   } catch (error) {
    //     console.error("Error updating profile:", error);
    //     res.sendStatus(500);
    //   } finally {
    //     client.release();
    //   }
    // }
  