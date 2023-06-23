const express = require("express");
const postGPT = require("../api/postGPT");
const getAffiliateInformation = require("../api/getAmazonAffiliateLink");
const router = express.Router();

const productMock = [
  {
    id: "B07XJ8C8F3",
    productName: "AI GENERATED ITEM",
    description:
      "Alexa-enabled for voice access to music, information, and more\nNoise-rejecting dual-microphone system for clear sound and voice pick-up\nBalanced audio performance at any volume\nHassle-free Bluetooth pairing, personalized settings, access to future updates, and more through the Bose connect app.Usb cable: 12 inch\nBose AR enabled — an innovative, audio-only version of augmented reality\nUnlock Bose AR via a firmware update through the Bose connect app\nBose AR availability and functionality varies. Bose AR enhanced apps are currently available for iPhone and iPad users only. Apps for Android devices are in development\nFor iPhone, iPad, and Android users, be sure your product’s firmware is up to date through the Bose connect app. Then you can access a showcase of Bose ar-enhanced apps with Links to download them.",
    price: 299,
    directImageSrc:
      "https://m.media-amazon.com/images/I/81+jNVOUsJL._AC_UY218_.jpg",
    link: "https://www.amazon.com/Bose-QuietComfort-Wireless-Headphones-Cancelling/dp/B07XJ8C8F3/ref=sr_1_1?dchild=1&keywords=bose+headphones&qid=1620129855&sr=8-1",
    reviews: [
      {
        rating: 5,
      },
    ],
  },
  {
    id: "B07XJ8C8F3",
    productName: "AI GENERATED ITEM2",
    directImageSrc:
      "https://m.media-amazon.com/images/I/71FyNyR1MJL._AC_SL1500_.jpg",
  },
  {
    id: "B07XJ8C8F3",
    productName: "AI GENERATED ITEM3",
    directImageSrc:
      "https://m.media-amazon.com/images/I/71FyNyR1MJL._AC_SL1500_.jpg",
  },
];

router.post("/", async (req, res) => {
  try {
    const chatGPTResponse = await postGPT(req.body);
    const getAmazonAffiliateLinkResponse = await getAffiliateInformation();
    res.send({ products: productMock, gptChoices: chatGPTResponse });
  } catch (err) {
    res.send("err");
  }
});
router.post("/amazon", async (req, res) => {
  try {
    const amazonResponse = await getAffiliateInformation(req.body);

    // res.send(amazonResponse);
    res.send(productMock);
  } catch (err) {
    res.send("err");
  }
});

module.exports = router;
