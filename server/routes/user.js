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
function loggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.send({ message: "not logged in" });
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

// change to put favorites
router.get("/favorites", verifyToken, (req, res) => {
  console.log("HIT GET FAVORITES", req.query.quizId);
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, async (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      const user = await User.findOne({
        _id,
      });
      console.log("?", req.query.quizId);

      const findProductArray = user.userData.filter(
        (wishlist) => wishlist.id === req.query.quizId
      );
      console.log("only one array", findProductArray);
      const matchingProducts = await Product.find({
        productId: { $in: findProductArray[0].wishlist },
      });
      // if (findProductArray) {
      //   const products = await Product.find({
      //     productId: { $in: findProductArray.userData[0].wishlist },
      //   }).then((result) => {
      //     console.log("RESULT", result);
      //   });
      // }

      // console.log(findProductArray.userData);
      // return res.status(200).json(findProductArray);
      res.send(matchingProducts);
      //TODO: Change to UPDATEONE
      // User.findById(_id, (err, user) => {
      //   console.log("found user", user);
      //   console.log("id", req.body.quizId);
      //   if (user) {
      //     for (i = 0; i < user.userData.length; i++) {
      //       if (user.userData[i].id == req.body.quizId) {
      //         user.userData[i].wishlist.push(req.body.product.productId);
      //         user.save((err, success) => {
      //           if (err) {
      //             console.log("Error in update", err);
      //             res.send("err", err);
      //           }
      //           if (success) {
      //             console.log(user);
      //             res.send(success);
      //           }
      //         });
      //       }
      //     }
      //   } else {
      //     res.send("No user");
      //   }
      // });
    }
  });
});
router.put("/favorites", verifyToken, (req, res) => {
  console.log("HIT UPDATE FAVORITES");
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

      //TODO: Change to UPDATEONE
      // User.findById(_id, (err, user) => {
      //   console.log("found user", user);
      //   console.log("id", req.body.quizId);
      //   if (user) {
      //     for (i = 0; i < user.userData.length; i++) {
      //       if (user.userData[i].id == req.body.quizId) {
      //         user.userData[i].wishlist.push(req.body.product.productId);
      //         user.save((err, success) => {
      //           if (err) {
      //             console.log("Error in update", err);
      //             res.send("err", err);
      //           }
      //           if (success) {
      //             console.log(user);
      //             res.send(success);
      //           }
      //         });
      //       }
      //     }
      //   } else {
      //     res.send("No user");
      //   }
      // });
    }
  });
});

router.delete("/favorites", verifyToken, (req, res) => {
  console.log("HIT DELETE FAVORITES");
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, (err, authData) => {
    if (err) {
      console.log("ERROR", err);
      res.sendStatus(403);
    } else {
      const { _id } = authData;
      User.findById(_id, (err, user) => {
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
      });
    }
  });
});
