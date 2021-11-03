const express = require("express");
// const { requireAuth } = require('./middleware');
const { Product } = require("../database/schemas");

const router = express.Router();

module.exports = router;

router.get("/", (req, res) => {
    // res.send({ message: 'hit route' });
    console.log(req)
  Product.find({}, (err, products) => {
    if (err) {
      res.status(400).send({ message: "Get product failed", err });
    } else {
      res.send({ message: "Product retrieved successfully", products });
    }
  });
});

// router.post("/", requireAuth, (req, res) => {
//   req.body.user = req.user.id;

//   const newTodo = Todo(req.body);

//   newTodo.save((err, savedTodo) => {
//     if (err) {
//       res.status(400).send({ message: "Create todo failed", err });
//     } else {
//       res.send({ message: "Todo created successfully", todo: savedTodo });
//     }
//   });
// });

// router.delete("/", requireAuth, (req, res) => {
//   Todo.findByIdAndRemove(req.body.id, (err) => {
//     if (err) {
//       res.status(400).send({ message: "Delete todo failed", err });
//     } else {
//       res.send({ message: "Todo successfully delete" });
//     }
//   });
// });
