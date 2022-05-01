const express = require('express');
const passport = require('passport');
const { User } = require('../database/schemas');
const router = express.Router();
const { requireAuth } = require('./middleware');
const bcrypt = require('bcrypt');

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

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!dbUserData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }
    const validPassword = await dbUserData.validatePassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.loggedIn = true;

      res
        .status(200)
        .json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.put('/password', async (req, res) => {
  const { oldPassword, newPassword, username } = req.body;

  const dbUserData = await User.findOne({
    where: {
      username,
    },
  });
  const validPassword = await dbUserData.validatePassword(oldPassword);

  if (validPassword) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        res.status(400).send({ err, message: 'Error updating password' });
      }
      bcrypt.hash(newPassword, salt, (err, hash) => {
        if (err) {
          res.status(400).send({ err, message: 'Error updating password' });
        }
        User.findOneAndUpdate(
          { username: username },
          { password: hash },
          (err) => {
            if (err) {
              res.status(400).send({ err, message: 'Error updating password' });
            }
            res.status(200).send({ message: 'Password successfully updated' });
          }
        );
      });
    });
  } else {
    res.status(400).send({ message: 'Old password did not match' });
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
