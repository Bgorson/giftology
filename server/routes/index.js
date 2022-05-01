const express = require('express');
const path = require('path');
const router = express.Router();

const products = require('./products');
const quiz = require('./quiz');
const auth = require('./auth');

router.use('/api/products', products);
router.use('/api/quiz', quiz);
router.use('/api/auth', auth);

router.get('/api/tags', (req, res) => {
  res.send([
    'MERN',
    'Node',
    'Express',
    'Webpack',
    'React',
    'Mongoose',
    'Bulma',
    'Fontawesome',
    'Ramda',
    'ESLint',
    'Jest',
  ]);
});

router.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../../dist/', 'index.html'));
});

module.exports = router;
