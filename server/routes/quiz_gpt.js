const express = require("express");
const postGPT = require("../api/postGPT");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const chatGPTResponse = await postGPT(req.body);
    res.send(chatGPTResponse);
  } catch (err) {
    console.log(err);
    res.send("err");
  }
});
module.exports = router;
