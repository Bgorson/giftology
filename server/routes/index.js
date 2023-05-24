const express = require("express");
const router = express.Router();

const products = require("./products");
const quiz = require("./quiz");
const auth = require("./auth");
const user = require("./user");
const quizv2 = require("./quiz_gpt");

router.use("/products", products);
router.use("/quiz", quiz);
router.use("/v2/quiz", quizv2);

router.use("/auth", auth);
router.use("/user", user);

module.exports = router;
