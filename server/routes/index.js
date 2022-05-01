const express = require('express');
const router = express.Router();

const products = require('./products');
const quiz = require('./quiz');
const auth = require('./auth');

router.use('/products', products);
router.use('/quiz', quiz);
router.use('/auth', auth);

module.exports = router;
