const express = require("express");
const { requireAuth } = require("./middleware");
const { User, Product } = require("../database/schemas");
const router = express.Router();
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

router.get("/", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      User.findById(_id, (err, user) => {
        res.send(user);
      });
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
      const user = await User.findOne({
        _id,
      });
      const findProductArray = user.userData.filter(
        (wishlist) => wishlist.id === req.query.quizId
      );
      const matchingProducts = await Product.find({
        productId: { $in: findProductArray[0].wishlist },
      });

      // Map each product to a Promise that resolves to the updated product
      const updatedProducts = await Promise.all(
        matchingProducts.map(async (product) => {
          if (product.website === "Etsy") {
            product.directImageSrc = await getImage(product.listingId);
          }
          return product;
        })
      );

      // Send the response with the updated products
      res.send(updatedProducts);
    }
  });
});

router.put("/favorites", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const update = await User.updateOne(
        { _id, "userData.id": req.body.quizId },
        { $push: { "userData.$.wishlist": req.body.product.productId } }
      );
      return res.status(200).json({ message: update });
    }
  });
});

router.delete("/favorites", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const { product } = req.body;
      const { productId } = product;
      await User.updateOne(
        { _id, "userData.id": req.body.quizId },
        { $pull: { "userData.$.wishlist": productId } }
      );

      res.send("Removed");
    }
  });
});
router.delete("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      User.findById(_id, (err, user) => {
        if (user) {
          const profileId = req.body.id;
          user.userData = user.userData.filter((item) => item.id !== profileId);

          user.save((err, success) => {
            if (err) {
              console.log("Error in update", err);
              return err;
            }
            console.log("Success", success);
            res.send(user);
          });
        } else {
          res.status(404).json({ message: "User not found", err });
        }
      });
    }
  });
});

router.patch("/profile", verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      User.findById(_id, (err, user) => {
        if (user) {
          const { id, url } = req.body;
          const profileIndex = user.userData.findIndex(
            (item) => item.id === id
          );
          user.userData[profileIndex].quizResults.createAccount = url;
          user.markModified("userData");
          user.save((err, success) => {
            if (err) {
              console.log("Error in update", err);
              return err;
            }
            console.log("Success", success);
            res.send(user);
          });
        } else {
          res.status(404).json({ message: "User not found", err });
        }
      });
    }
  });
});

router.post("/mailingList", (req, res) => {
  const { userName, email } = req.body;

  User.findOne({ email }).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Something went wrong",
      });
    } else {
      //Login
      if (user) {
        res.json({ message: "User already exists" });
      } else {
        //Signup
        const newUser = new User({
          name: userName,
          email: email,
          mailingList: true,
        });
        newUser.save((err, data) => {
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
  // add to User database
  // if user already exists, don't do anything
  // if user doesn't exist, add to database
});
