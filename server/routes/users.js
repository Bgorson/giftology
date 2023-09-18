const express = require("express");

const router = express.Router();

module.exports = router;

router.post("/checkusername", (req, res) => {
  res.send("Not implemented");
  // const username = req.body.username.toLowerCase();

  // User.find({ username }, (err, users) => {
  //   if (err) {
  //     res.status(400).send({ message: 'Check username failed', err, username });
  //   }
  //   if (users && users[0]) {
  //     res.send({ available: false, message: 'Username exists', username });
  //   } else {
  //     res.send({ available: true, message: 'Username available', username });
  //   }
  // });
});
