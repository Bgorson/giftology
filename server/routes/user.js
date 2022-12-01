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
      res.sendStatus(403);
    } else {
      res.json({
        message: 'All good',
      });
    }
  });

  console.log('userobject', req.user);
  res.send({ message: 'User info successfully retreived' });
});

// router.put('/', requireAuth, (req, res) => {
//   req.body.updated_at = Date.now();

//   User.findByIdAndUpdate(
//     { _id: req.user._id },
//     req.body,
//     { new: true },
//     (err, user) => {
//       if (err) {
//         res.status(400).send({ err, message: 'Error updating user' });
//       }
//       res.status(200).send({
//         message: 'User successfully updated',
//         user: user.hidePassword(),
//       });
//     }
//   );
// });
