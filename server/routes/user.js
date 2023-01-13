const express = require("express");
const { requireAuth } = require("./middleware");
const { User, Product } = require("../database/schemas");
const router = express.Router();
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

router.get("/favorites", verifyToken, (req, res) => {
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
      res.send(matchingProducts);
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
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      User.findById(_id, (err, user) => {
        if (user) {
          const index = user.indexOf(req.body);
          if (index > -1) {
            // only splice array when item is found
            user.splice(index, 1); // 2nd parameter means remove one item only
          }
          user.save((err, success) => {
            if (err) {
              console.log("Error in update", err);
              return err;
            }
            res.send(user);
          });
        } else {
          res.status(404).json({ message: "User not found", err });
        }
      });
    }
  });
});
