const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../database/schemas");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

module.exports = router;

// Login
router.post("/login", async (req, res) => {
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
            error: "Something went wrong",
          });
        } else {
          //Login
          if (user) {
            const token = jwt.sign(
              { _id: user._id },
              process.env.JWT_ACC_ACTIVATE,
              { expiresIn: "7d" }
            );
            const { _id, name, email } = user;
            res.json({ token, user: { _id, name, email } });
          } else {
            //Signup
            let newUser = new User({ name, email });
            newUser.save((err, data) => {
              if (err) {
                return res.status(400).json({
                  error: "Something went wrong",
                });
              }
              const token = jwt.sign(
                { _id: data },
                process.env.JWT_ACC_ACTIVATE,
                { expiresIn: "7d" }
              );
              const { _id, name, email } = data;

              res.json({ token, user: { _id, name, email } });
            });
          }
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Logout
router.post("/logout", (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
