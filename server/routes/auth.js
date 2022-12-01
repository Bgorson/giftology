const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { User } = require('../database/schemas');
const router = express.Router();
const { requireAuth } = require('./middleware');
const { OAuth2Client } = require('google-auth-library');

module.exports = router;

// router.post('/', async (req, res) => {
//   try {
//     console.log('USER', User);
//     const dbUserData = await User.create({
//       username: req.body.username,
//       password: req.body.password,
//     });

//     req.session.save(() => {
//       req.session.loggedIn = true;

//       res.status(200).json(dbUserData);
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });

router.post('/signup', async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  User.findOne({ email }).exec((err, user) => {
    if (user) {
      return res.status(400).json({ error: 'User with e mail exists' });
    }
    const token = jwt.sign(
      { name, email, password },
      process.env.JWT_ACC_ACTIVATE,
      { expiresIn: '20m' }
    );

    let newUser = new User({ name, email, password });
    newUser.save((err, success) => {
      if (err) {
        console.log('Error in signup', err);
        return res.status(400).json({ error: 'Signup Error' });
      }
      res.json({
        message: 'sign up successful',
      });
    });
  });
});

// Login
router.post('/login', async (req, res, next) => {
  console.log('REQ', req.query);
  const client = new OAuth2Client(process.env.CLIENT_ID);

  const { token } = req.body;
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email_verified, name, email } = payload;
    if (email_verified) {
      User.findOne({ email }).exec((err, user) => {
        if (err) {
          return res.status(400).json({
            error: 'Something went wrong',
          });
        } else {
          if (user) {
            const token = jwt.sign(
              { _id: user._id },
              process.env.JWT_ACC_ACTIVATE,
              { expiresIn: '7d' }
            );
            const { _id, name, email } = user;
            res.json({ token, user: { _id, name, email } });
          } else {
            let newUser = new User({ name, email });
            newUser.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: 'Something went wrong',
                });
              }
              const token = jwt.sign(
                { _id: user._id },
                process.env.JWT_ACC_ACTIVATE,
                { expiresIn: '7d' }
              );
              const { _id, name, email } = newUser;

              res.json({ token, user: { _id, name, email } });
            });
          }
        }
      });
    }
    // User.find({ email: payload.email }, function (err, docs) {
    //   if (err) {
    //     console.log(err);
    //   } else {
    //     console.log('First function call : ', docs);
    //     if (docs.length > 0) {
    //       console.log('sending payload', docs);
    //       console.log('TOKEN', payload);

    //       res.send({
    //         email: docs[0].email,
    //         name: docs[0].name,
    //         isNew: docs[0].isNew,
    //       });
    //     } else {
    //       User.create({
    //         email: payload.email,
    //         name: payload.name,
    //       }),
    //         function () {
    //           res.send(payload);
    //         };
    //     }
    //   }
    // });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
