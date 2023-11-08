const express = require("express");
const postGPT = require("../api/postGPT");
const getAffiliateInformation = require("../api/getAmazonAffiliateLink");
const router = express.Router();
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const addProduct = require("../utils/addProduct");
const pool = require("../dataBaseSQL/db");
function extractPrice(text) {
  // Regular expression to match price patterns like $27.99 or 27.99 ($7.00 / Count)
  var pricePattern = /\$?(\d+\.\d{2})/;

  // Extract price using regular expression
  var match = text.match(pricePattern);

  // Check if a match is found
  if (match && match[1]) {
    return parseFloat(match[1]); // Convert the matched value to a float
  } else {
    return "unknown"; // Return "unknown" if no valid price is found
  }
}
// const productMock = [
//   {
//     id: "B07XJ8C8F3",
//     productName: "AI GENERATED ITEM",
//     description:
//       "Alexa-enabled for voice access to music, information, and more\nNoise-rejecting dual-microphone system for clear sound and voice pick-up\nBalanced audio performance at any volume\nHassle-free Bluetooth pairing, personalized settings, access to future updates, and more through the Bose connect app.Usb cable: 12 inch\nBose AR enabled — an innovative, audio-only version of augmented reality\nUnlock Bose AR via a firmware update through the Bose connect app\nBose AR availability and functionality varies. Bose AR enhanced apps are currently available for iPhone and iPad users only. Apps for Android devices are in development\nFor iPhone, iPad, and Android users, be sure your product’s firmware is up to date through the Bose connect app. Then you can access a showcase of Bose ar-enhanced apps with Links to download them.",
//     price: 299,
//     directImageSrc:
//       "https://m.media-amazon.com/images/I/81+jNVOUsJL._AC_UY218_.jpg",
//     link: "https://www.amazon.com/Bose-QuietComfort-Wireless-Headphones-Cancelling/dp/B07XJ8C8F3/ref=sr_1_1?dchild=1&keywords=bose+headphones&qid=1620129855&sr=8-1",
//     reviews: [
//       {
//         rating: 5,
//       },
//     ],
//   },
//   {
//     id: "B07XJ8C8F3",
//     productName: "AI GENERATED ITEM2",
//     directImageSrc:
//       "https://m.media-amazon.com/images/I/71FyNyR1MJL._AC_SL1500_.jpg",
//   },
//   {
//     id: "B07XJ8C8F3",
//     productName: "AI GENERATED ITEM3",
//     directImageSrc:
//       "https://m.media-amazon.com/images/I/71FyNyR1MJL._AC_SL1500_.jpg",
//   },
// ];

router.post("/", async (req, res) => {
  try {
    const chatGPTResponse = await postGPT(req.body);
    // const getAmazonAffiliateLinkResponse = await getAffiliateInformation();

    // const singleResponse = await getAffiliateInformation({
    //   productName: chatGPTResponse[0],
    // });
    // console.log("response", singleResponse);
    // console.log("AMAZON RESPONSE", amazonResponse);

    res.send({ gptChoices: chatGPTResponse });
  } catch (err) {
    res.send("err");
  }
});

router.post("/amazon", async (req, res) => {
  const client = await pool.connect();
  try {
    const { productName } = req.body;
    const amazonResponse = await getAffiliateInformation({
      productName,
    });
    // check if the product already exists:
    const checkProductQuery = "SELECT * FROM products WHERE product_name = $1";
    const checkProductResult = await client.query(checkProductQuery, [
      amazonResponse.productName,
    ]);

    if (checkProductResult.rows.length !== 0) {
      const product = checkProductResult.rows[0];
      const productShape = {
        product_id: product.product_id,
        productName: product.product_name,
        direct_image_src: product.direct_image_src,
        link: product.link,
        flavor_text:
          "This item was recommended by our AI engine, if you like it, be sure to click favorites.",
        price: product.product_base_price,
      };

      res.send(productShape);
      return;
    }
    try {
      // Add to Database

      // const productSpecific = await postGPT({
      //   productSpecific: true,
      //   product: amazonResponse.productName,
      // });

      const product = {
        product_name: amazonResponse.productName,
        website: "amazon",
        link: amazonResponse.link,
        product_base_price: extractPrice(amazonResponse.price),
        gift_type_id: [],
        category_id: "",
        direct_image_src: amazonResponse.directImageSrc,
        age_min: 0,
        age_max: 99,
        flavor_text:
          "This item was recommended by our AI engine, if you like it, be sure to click favorites.",
      };
      let hobbyIDArray = [];
      const tagIDArray = [];
      // if (productSpecific.Hobbies) {
      //   const findHobbiesQuery =
      //     "SELECT * FROM hobbies_interests_list WHERE hobbies_interests_name = $1";

      //   // Array to store promises for async operations
      //   const promises = [];

      //   // For each hobby name, create a promise for the asynchronous operation
      //   productSpecific.Hobbies.forEach((hobby) => {
      //     const promise = new Promise(async (resolve) => {
      //       const findHobbiesResult = await client.query(findHobbiesQuery, [
      //         hobby,
      //       ]);
      //       if (findHobbiesResult.rows.length === 0) {
      //         const insertHobbiesQuery =
      //           "INSERT INTO hobbies_interests_list (hobbies_interests_name) VALUES ($1) RETURNING *";
      //         const insertHobbiesResult = await client.query(
      //           insertHobbiesQuery,
      //           [hobby]
      //         );
      //         resolve(insertHobbiesResult.rows[0].id);
      //       } else {
      //         resolve(findHobbiesResult.rows[0].id);
      //       }
      //     });

      //     // Add the promise to the promises array
      //     promises.push(promise);
      //   });

      //   // Wait for all promises to resolve using Promise.all()
      //   Promise.all(promises)
      //     .then((hobbyIDs) => {
      //       // Now all async operations have finished, and hobbyIDs contains the results
      //       hobbyIDArray.push(...hobbyIDs);
      //     })
      //     .catch((error) => {
      //       console.error("Error occurred:", error);
      //     });
      // }
      // if (productSpecific.Tags) {
      //   const findTagsQuery = "SELECT * FROM tag_list WHERE tag_name = $1";
      //   const tagPromises = [];

      //   productSpecific.Tags.forEach((tag) => {
      //     const promise = new Promise(async (resolve) => {
      //       const findTagsResult = await client.query(findTagsQuery, [tag]);
      //       if (findTagsResult.rows.length === 0) {
      //         const insertTagsQuery =
      //           "INSERT INTO tag_list (tag_name) VALUES ($1) RETURNING *";
      //         const insertTagsResult = await client.query(insertTagsQuery, [
      //           tag,
      //         ]);
      //         resolve(insertTagsResult.rows[0].id);
      //       } else {
      //         resolve(findTagsResult.rows[0].id);
      //       }
      //     });

      //     tagPromises.push(promise);
      //   });

      //   Promise.all(tagPromises)
      //     .then((tagIDs) => {
      //       tagIDArray.push(...tagIDs);
      //     })
      //     .catch((error) => {
      //       console.error("Error occurred while processing tags:", error);
      //     });
      // }
      // if (productSpecific.Category) {
      //   const findCategory =
      //     "SELECT * FROM categories_list WHERE category_name = $1";
      //   const findCategoryResult = await client.query(findCategory, [
      //     productSpecific.Category[0].replace(/[{},"]/g, ""),
      //   ]);
      //   if (findCategoryResult.rows.length === 0) {
      //     const insertCategoryQuery =
      //       "INSERT INTO categories_list (category_name) VALUES ($1) RETURNING *";
      //     const insertCategoryResult = await client.query(insertCategoryQuery, [
      //       productSpecific.Category[0].replace(/[{},"]/g, ""),
      //     ]);
      //     product.category_id = insertCategoryResult.rows[0].id;
      //   } else {
      //     product.category_id = findCategoryResult.rows[0].id;
      //   }
      // } else {
      //   const findCategory =
      //     "SELECT * FROM categories_list WHERE category_name = 'Other'";

      //   const findCategoryResultOther = await client.query(findCategory);
      //   if (findCategoryResultOther.rows.length === 0) {
      //     const insertCategoryQuery =
      //       "INSERT INTO categories_list (category_name) VALUES ($1) RETURNING *";
      //     const insertCategoryResult = await client.query(insertCategoryQuery, [
      //       "Other",
      //     ]);
      //     product.category_id = insertCategoryResult.rows[0].id;
      //   } else {
      //     product.category_id = findCategoryResultOther.rows[0].id;
      //   }
      // }

      product.hobbies_id = hobbyIDArray;
      product.tags_id = tagIDArray;

      const addedID = await addProduct({ product, userAdded: false });
      console.log("ADDED", addedID);
      product.product_id = addedID;
      res.send(product);
    } catch (err) {}
  } catch (err) {
  } finally {
    client.release();
  }
});

module.exports = router;
