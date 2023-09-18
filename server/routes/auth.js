const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { OAuth2Client } = require("google-auth-library");

const pool = require("../dataBaseSQL/db");

module.exports = router;

const client = new OAuth2Client(process.env.CLIENT_ID);

router.post("/login", async (req, res) => {
  const { token, name: userName, email: userEmail } = req.body;

  try {
    // Verify Google ID token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,
    });
    const payload = ticket.getPayload();

    const { email_verified, email: payloadEmail, name: payloadName } = payload;
    if (email_verified) {
      // Check if the user exists in the database
      const userQuery = "SELECT * FROM users WHERE email = $1";
      const userValues = [payloadEmail];

      const result = await pool.query(userQuery, userValues);
      const user = result.rows[0];

      if (user) {
        // User exists, proceed with login logic
        // Generate JWT token using user's auth_id as identifier
        const token = jwt.sign(
          { _id: payloadEmail },
          process.env.JWT_ACC_ACTIVATE,
          {
            expiresIn: "7d",
          }
        );
        const { auth_id, name, email } = user;
        res.json({ token, user: { _id: auth_id, name, email } });
      } else {
        console.log("SIGINIG UP");
        const token = jwt.sign(
          { _id: payloadEmail },
          process.env.JWT_ACC_ACTIVATE,
          { expiresIn: "7d" }
        );
        // User doesn't exist, create a new user and generate token
        const newUserQuery =
          "INSERT INTO users (name, email, user_data, auth_id) VALUES ($1, $2, $3,$4) RETURNING *";
        const newUserValues = [payloadName, payloadEmail, null, token];

        const newUserResult = await pool.query(newUserQuery, newUserValues);
        const newUser = newUserResult.rows[0];

        // Generate JWT token using newly generated auth_id

        const { name, email } = newUser;

        res.json({ token, user: { name, email } });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
router.post("/logout", (req, res) => {
  // Handle your logout logic here
  res.status(204).end();
});
