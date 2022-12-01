const express = require('express');
const router = express.Router();

const products = require('./products');
const quiz = require('./quiz');
const auth = require('./auth');
const user = require('./user');

router.use('/products', products);
router.use('/quiz', quiz);
router.use('/auth', auth);
// router.use('/user', user);

module.exports = router;
