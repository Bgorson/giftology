const express = require('express');
const { requireAuth } = require('./middleware');
const { User } = require('../database/schemas');
const router = express.Router();
const jwt = require('jsonwebtoken');
module.exports = router;

function verifyToken(req, res, next) {
  const bearerHeader = req.headers['authorization'];

  if (typeof bearerHeader !== 'undefined') {
    const bearerToken = bearerHeader.split(' ')[1];

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
    res.send({ message: 'not logged in' });
  }
}
router.get('/', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, (err, authData) => {
    if (err) {
      console.log('ERROR', err);
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
// router.get('/favorites', verifyToken, (req, res) => {
//   console.log('HIT');
//   jwt.verify(req.token, process.env.JWT_ACC_ACTIVATE, (err, authData) => {
//     if (err) {
//       console.log('ERROR', err);
//       res.sendStatus(403);
//     } else {
//       const { _id } = authData;
//       User.findById(_id, (err, user) => {
//         res.send(user);
//       });
//     }
//   });
// });
