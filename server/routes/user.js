const express = require("express");
const router = express.Router();
const pool = require("../dataBaseSQL/db");

const getImage = require("../api/getEtsy");

const jwt = require("jsonwebtoken");
module.exports = router;

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

router.get("/favorites", verifyToken, async (req, res) => {
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

        const findProductArray = JSON.parse(user.user_data).filter(
          (wishlist) => wishlist.id === req.query.quizId
        );
        const productIds = findProductArray[0].wishlist;

        const productQuery =
          "SELECT * FROM products WHERE product_id = ANY($1::int[])";
        const productResult = await client.query(productQuery, [productIds]);
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

router.put("/favorites", verifyToken, async (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const client = await pool.connect();
      try {
        // Fetch and parse user_data as JSON
        const user = await client.query(
          "SELECT user_data FROM users WHERE email = $1",
          [_id]
        );
        let userData = user.rows[0].user_data || "[]"; // Default to empty array if null

        // Find the index of the quizId in the userData array
        const quizId = req.body.quizId;
        const product = req.body.product.product_id;
        const index = JSON.parse(userData).findIndex(
          (entry) => entry.id === quizId
        );
        if (index > -1) {
          let parsed = JSON.parse(userData);
          // If quizId exists in userData, add product to its wishlist
          parsed[index].wishlist.push(product);
          userData = JSON.stringify(parsed);
        }
        // Convert userData back to a string

        // Update user_data with the new string representation
        const updateQuery = "UPDATE users SET user_data = $1 WHERE email = $2";
        const updateValues = [userData, _id];

        await client.query(updateQuery, updateValues);

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
    } else {
      const { _id } = authData;
      const client = await pool.connect();
      try {
        // Fetch and parse user_data as JSON
        const user = await client.query(
          "SELECT user_data FROM users WHERE email = $1",
          [_id]
        );
        let userData = JSON.parse(user.rows[0].user_data || "[]"); // Default to empty array if null

        // Find the index of the quizId in the userData array
        const quizId = req.body.quizId;
        const product = req.body.product.product_id;

        const index = userData.findIndex((entry) => entry.id === quizId);

        if (index !== -1) {
          // If quizId exists in userData, remove the product from its wishlist
          userData[index].wishlist = userData[index].wishlist.filter(
            (item) => item !== product
          );
        }

        // Convert userData back to a string
        const updatedUserData = JSON.stringify(userData);

        // Update user_data with the new string representation
        const updateQuery = "UPDATE users SET user_data = $1 WHERE email = $2";
        const updateValues = [updatedUserData, _id];

        await client.query(updateQuery, updateValues);

        res.status(200).json({ message: "Removed from wishlist" });
      } catch (error) {
        console.error("Error deleting from favorites:", error);
        res.sendStatus(500);
      } finally {
        client.release();
      }
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
           const updateBehaviorQuery = `UPDATE user_behaviors SET clicked_favorite = $1, clicked_info = $2, clicked_retailer = $3 WHERE product_id = $4 AND quiz_id = $5 AND user_id = $6`;
           await client.query(updateBehaviorQuery, [preExistingbehavior.clicked_favorite|| behavior.clicked_favorite, preExistingbehavior.clicked_info || behavior.clicked_info, preExistingbehavior.clicked_retailer||behavior.clicked_retailer, product, quizId, userId]);
        } else {
          const insertBehaviorQuery = `INSERT INTO user_behaviors (clicked_favorite,clicked_info,clicked_retailer, product_id, quiz_id, user_id) VALUES ($1, $2, $3, $4, $5, $6)`;
          await client.query(insertBehaviorQuery, [behavior.clicked_favorite, behavior.clicked_info, behavior.clicked_retailer, product, quizId, userId]);
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
  