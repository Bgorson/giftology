const express = require("express");
const getImage = require("../api/getEtsy");
const router = express.Router();

const joinProductQuery = `SELECT
p.product_id,
p.product_name,
p.*,
ARRAY_AGG(DISTINCT cl.category_name) AS category,
ARRAY_AGG(DISTINCT gl.gift_type_name) AS gift_type,
ARRAY_AGG(DISTINCT ol.occassion_name) AS occasion,
ARRAY_AGG(DISTINCT tl.tag_name) AS tags,
ARRAY_AGG(DISTINCT CASE WHEN t.display_on_card = true THEN tl.tag_name ELSE NULL END) AS tags_display,
ARRAY_AGG(DISTINCT CASE WHEN t.use_in_calculating = true THEN tl.tag_name ELSE NULL END) AS tags_sort

FROM
products AS p
LEFT JOIN
categories AS c ON p.product_id = c.product_id
LEFT JOIN
categories_list AS cl ON c.category_id = cl.id
LEFT JOIN
gift_type AS gt ON p.product_id = gt.product_id
LEFT JOIN
gift_type_list AS gl ON gt.gift_type_id = gl.id
LEFT JOIN
occasion AS o ON p.product_id = o.product_id
LEFT JOIN
occasion_list AS ol ON o.occasion_id = ol.id
LEFT JOIN
tags AS t ON p.product_id = t.product_id
LEFT JOIN
tag_list AS tl ON t.tag_id  = tl.id  
GROUP BY
p.product_id, p.product_name;
`;

const pool = require("../dataBaseSQL/db");

const updateUser = async (email, answers, quizId) => {
  const client = await pool.connect();
  try {
    let generatedId = quizId;
    const foundUserQuery = "SELECT * FROM users WHERE email = $1";
    const foundUserResult = await client.query(foundUserQuery, [email]);
    const foundUser = foundUserResult.rows[0] || {};
    const { who, name, age, occasion, hobbies, tags, gender } = answers;
    const foundQuizQuery = "SELECT * FROM quizs WHERE quiz_id = $1";
    const foundQuiz = await client.query(foundQuizQuery, [generatedId]);
    if (!foundQuiz.rows[0]) {
      const detectDebounce = await client.query(
        "SELECT * FROM quizs WHERE user_id = $1 AND created_at > NOW() - INTERVAL '1 minute'",
        [foundUser?.id || null]
      );
      if (detectDebounce.rows[0]) {
        return { ...answers, id: generatedId };
      } else {
        const insertQuizQuery =
          "INSERT INTO quizs (quiz_id, user_id, who, gender, name, age, occasion, hobbies, tags) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)";
        await client.query(insertQuizQuery, [
          generatedId,
          foundUser?.id || null,
          who,
          gender ? gender : "ratherNot",
          name,
          age,
          occasion,
          hobbies,
          tags,
        ]);
      }
    }

    return { ...answers, id: generatedId };
    // if (foundUser) {
    //   const quizId = v4();
    //   const newQuizData = {
    //     id: quizId,
    //     quizResults: answers,
    //     wishlist: [],
    //   };
    //   if (foundUser.user_data) {
    //     let userData = JSON.parse(foundUser.user_data);
    //     let oldWishList = [];

    //     for (let i = 0; i < userData.length; i++) {
    //       if (userData[i].quizResults.name === answers.name) {
    //         oldWishList = userData[i].wishlist;
    //         userData.splice(i, 1);
    //       }
    //     }

    //     newQuizData.wishlist = oldWishList;
    //     userData.push(newQuizData);

    //     const updateUserQuery =
    //       "UPDATE users SET user_data = $1 WHERE email = $2";
    //     await client.query(updateUserQuery, [JSON.stringify(userData), email]);
    //   } else {
    //     const updateUserQuery =
    //       "UPDATE users SET user_data = $1 WHERE email = $2";
    //     await client.query(updateUserQuery, [
    //       JSON.stringify([newQuizData]),
    //       email,
    //     ]);
    //   }
    //   return newQuizData;
    // } else {
    //   console.log("User not found.");
    // }
  } catch (error) {
    console.error("Error updating user:", error);
  } finally {
    client.release();
  }
};

// Score Calculation Helpers
const decimalAdjust = (type, value, exp) => {
  // If the exp is undefined or zero...
  if (typeof exp === "undefined" || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === "number" && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split("e");
  value = Math[type](+(value[0] + "e" + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split("e");
  return +(value[0] + "e" + (value[1] ? +value[1] + exp : exp));
};
const round10 = (value, exp) => decimalAdjust("round", value, exp);

const retriveProducts = async () => {
  const client = await pool.connect();
  try {
    const query = joinProductQuery;
    // Need to update query with a join to get additional info
    const result = await client.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error retrieving products:", error);
    return [];
  } finally {
    client.release();
  }
};
const calculateScoreForAll = async (filteredProducts, quizResults) => {
  // let minPrice = 0;
  // let maxPrice = 5000;

  for (const product of filteredProducts) {
    let score = 0;

    // filteredArray.forEach(async function (product) {
    // FETCH ETSY IMAGE IF NEEDED
    if (product.website == "Etsy") {
      const imageURL = await getImage(product.listing_id);
      product.direct_image_src = imageURL;
    }
    let hArray = product.hobbies_interests;
    if (hArray == null) {
      hArray = "";
    }
    let oArray = product.occasion;

    if (oArray == null) {
      oArray = [];
    }
    const tagArray = product.tags_sort;
    const lowerCase = hArray;
    const lowerCaseTagArray = tagArray;
    const lowerCaseOc = Array.isArray(oArray)
      ? oArray.map((array) => (array ? array.toLowerCase() : ""))
      : oArray.toLowerCase();

    // SCORING HOBBIES
    if (quizResults.hobbies) {
      quizResults.hobbies.forEach((hobby) => {
        if (lowerCase.includes(hobby.toLowerCase()) || lowerCase === hobby) {
          // console.log('product name', product.productName);
          // console.log('matching hobby', product.productName);

          score = score + 1;
        }
      });
    }

    // SCORING OCCASIONS
    if (lowerCaseOc.length > 0) {
      if (lowerCaseOc.includes(quizResults?.occasion?.toLowerCase())) {
        // console.log('product name', product.productName);
        // console.log('matching hobby', product.productName);

        score = score + 1;
      }
    }

    // SCORING TAGS
    if (quizResults.tags) {
      let tagScore = 0;
      quizResults.tags.forEach((tag) => {
        if (lowerCaseTagArray.includes(tag.toLowerCase())) {
          tagScore++;
        }
      });
      score += tagScore;
    }
    if (quizResults.coworkerTags) {
      let tagScore = 0;
      quizResults.coworkerTags.forEach((tag) => {
        if (lowerCaseTagArray.includes(tag.toLowerCase())) {
          tagScore++;
        }
      });
      score += tagScore;
    }

    if (quizResults.who == "coworker" && product.who_ind === "coworker") {
      score = score + 25;
    }
    if (quizResults.price) {
      let minPrice = parseInt(quizResults.price.split("-")[0]);
      let maxPrice = parseInt(quizResults.price.split("-")[1]);

      if (
        product.product_base_price >= minPrice &&
        product.product_base_price <= maxPrice &&
        score > 0
      ) {
        // console.log('matching price', product.productName);

        score = score + 100;
      }
    }
    product.score = score;
  }
  return filteredProducts;
};
// Put all products in a group by category
const groupBy = (arr, property) => {
  return arr.reduce((memo, x) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
};

// full path is api/quiz
// CURRENT MAIN QUIZ ROUTE
// router.post("/testPython", async (req, res) => {
//   const path = require("path");
//   const jsonObject = JSON.stringify(req.body.answers);
//   const pythonScriptPath = path.join(__dirname, "../../main.py");
//   console.log(pythonScriptPath);
//   const spawn = require("child_process").spawn;
//   const pythonProcess = spawn("python", [pythonScriptPath, jsonObject], {
//     stdio: ["pipe", "pipe", "pipe"],
//   });

//   let result = [];

//   pythonProcess.stdout.on("data", (data) => {
//     result += data.toString();
//     console.log("stdout", result);
//   });
//   pythonProcess.stderr.on("data", (data) => {
//     console.log(data.toString());
//   });
//   pythonProcess.on("exit", (code) => {
//     console.log("RESULT IN NODE", result);

//     res.send(result);
//   });
//   pythonProcess.stdin.write(JSON.stringify(req.body));
//   pythonProcess.stdin.end();
// });
router.post("/allProducts", async (req, res) => {
  let quizData;
  const path = require("path");
  quizData = await updateUser(
    req.body.email,
    req.body.answers,
    req.body.quizId
  );
  const answerShape = {
    "who": req.body.answers.who,
    "gender": req.body.answers.gender,
    "name": req.body.answers.name,
    "age": req.body.answers.age,
    "occasion": req.body.answers.occasion,
    "hobbies": req.body.answers.hobbies,
    "tags": req.body.answers.tags
}
  const jsonObject = JSON.stringify({
    ...answerShape,
    quiz_id: req.body.quizId,
    created_at: new Date(),
  });

  const pythonScriptPath = path.join(__dirname, "../../main.py");
  const spawn = require("child_process").spawn;
  const pythonProcess = spawn("python", [pythonScriptPath, jsonObject], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  let result = [];

  pythonProcess.stdout.on("data", (data) => {
    result += data.toString();
    // console.log("stdout", result);
  });
  pythonProcess.stderr.on("data", (data) => {
    // console.log(data.toString());
  });
  pythonProcess.on("exit", async (code) => {
    // console.log("exit");
    const { answers: quizResults } = req.body;
    // const client = await pool.connect();
    // try {
    //   const insertResultQuery =
    //     "INSERT INTO result_table (textresult) VALUES ($1)";
    //   await client.query(insertResultQuery, [result]);
    // } catch (error) {
    //   console.error("Error inserting result into database:", error);
    // } finally {
    //   client.release();
    // }
    // if (true) {
    //   return res.send({
    //     products: [
    //       {
    //         product_id: 100073,
    //         score: 1,
    //         product_name: "Apple AirPods Pro (2nd Gen)",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Apple-Generation-Cancelling-Transparency-Personalized/dp/B0BDHWDR12?crid=390I93XBFVLI3&keywords=airpods%2Bpro%2B2&qid=1671412847&sprefix=airpods%2Caps%2C135&sr=8-1&ufe=app_do%3Aamzn1.fos.f5122f16-c3e8-4386-bf32-63e904010ad0&th=1&linkCode=li2&tag=giftology02-20&linkId=4140cdbdd34ce1bcb69a2187b1315d0a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BDHWDR12&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0BDHWDR12" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40UEob6",
    //         flavor_text:
    //           "Athletes, music lovers, podcast fans, and office dwellers, we can't recommend these enough.",
    //         lab_results:
    //           "Lab Results: Truth be told, I wanted to not like these. Still giving them a fair shake, they really deliver. They fit in the ear shockingly well and never fall out as you might fear. Battery life on a single charge is only 4-5 hours, but I rarely run into that issue in real life, since the requisite carrying case provides up to 24 hours of additional life. The main addition to the Pro series is Active Noise cancellation, which is a great add. I find myself listening to music and podcasts far more frequently now that I have a pair.",
    //         product_base_price: 249,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "technology,homeOffice,music",
    //         tags: "nerdy,trendy,music,technology",
    //         tags_sort: "trendy,music,technology",
    //         tags_display: "technology,trendy,music",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/W/WEBP_402378-T2/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100074,
    //         score: 0.982356452625178,
    //         product_name: "Light Up Word Clock",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Sharper-Image-Electronic-Display-Contemporary/dp/B07CD7S9PZ?keywords=Unique%2BFun%2BGifts&qid=1642358582&sr=8-4&th=1&linkCode=li2&tag=giftology02-20&linkId=f2c03ea4983ffa0adb5331291f99bef0&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07CD7S9PZ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07CD7S9PZ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3KnDRsO",
    //         flavor_text:
    //           "If they're always running late, they should at least have a cool clock let them know.",
    //         lab_results:
    //           "Lab Results: There's something vaguely steampunk about the whole ensemble that makes this clock pretty neat. As an important note, it's plug-in only rather than battery operated, but besides that there's a lot to like about this clock.",
    //         product_base_price: 24.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "technology",
    //         tags: "nerdy,trendy,technology",
    //         tags_sort: "nerdy,trendy,technology",
    //         tags_display: "justForFun,nerdy,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81q8EvDktLL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100059,
    //         score: 0.9660049993280752,
    //         product_name: "Tile Mate",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Tile-RE-19001-Mate-1-Pack/dp/B07W9BBCTB?crid=2ONCG5UD8UJJP&keywords=tiles%2Btracker&qid=1636922788&sprefix=tile%2Caps%2C197&sr=8-3&th=1&linkCode=li2&tag=giftology02-20&linkId=1041e89dd8ed513412167e47233bedf5&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07W9BBCTB&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07W9BBCTB" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3M5ScLV",
    //         flavor_text:
    //           "Forgetful technologist who can never find their keys.",
    //         lab_results:
    //           "Lab Results: This is a perfect little stocking stuffer for the tech-enthusiast in your life. It falls neatly into a category of extremely intriguing but not something you might buy on your own without a little nudge.",
    //         product_base_price: 24.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "technology",
    //         tags: "nerdy,technology",
    //         tags_sort: "nerdy,technology",
    //         tags_display: "technology,nerdy,technology",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/41pN1F9-RaL._AC_SL1214_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100056,
    //         score: 0.9504004948913917,
    //         product_name: "Echo Dot (3rd Gen) - Smart speaker with Alexa",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Echo-Dot/dp/B07FZ8S74R?keywords=alexa+mini&qid=1636922296&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExTjdRNVMzMjZNV0JZJmVuY3J5cHRlZElkPUEwNDU1MTAzQk5LOUZRUFJORFUmZW5jcnlwdGVkQWRJZD1BMDI2NDA4OTFZMlRUOThUU0dETVcmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl&linkCode=li2&tag=giftology02-20&linkId=bf7c76ca5c0b3c0c8d042bec09db070e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07FZ8S74R&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07FZ8S74R" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3G9EDqK",
    //         flavor_text:
    //           "Would you prefer that your house by wired with surround sound so your favorite music and follow you from room to room?",
    //         lab_results:
    //           "Lab Results: These smart speakers are easy to set up, pair well with each other, and end up being surprisingly addictive to use. Seriously, the frequency that we ask Alexa for a quick search to settle a bet is stunning. If you are purely looking for sound quality you can probably do better but given all the other functions and the price point, we really like these little devices.",
    //         product_base_price: 24.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials",
    //         hobbies_interests: "technology,music",
    //         tags: "music,technology",
    //         tags_sort: "music,technology",
    //         tags_display: "technology,music",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61MZfowYoaL._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100099,
    //         score: 0.9252565467799853,
    //         product_name: "Ember Temperature Mug",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Ember-Temperature-Control-1-5-hr-Battery/dp/B07NQRM6ML?crid=6UQ0PCPNWCTU&keywords=ember%2Bmug&qid=1643403311&sprefix=ember%2Bmu%2Caps%2C138&sr=8-5&th=1&linkCode=li2&tag=giftology02-20&linkId=c05d9e8e93a2d78a4c30fd7ab3387d0f&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07NQRM6ML&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07NQRM6ML" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U3AcU8",
    //         flavor_text: "Always have the perfect temperature for your drinks.",
    //         lab_results:
    //           "Lab Results: Do you know someone that drinks a lot of coffee, but drinks too slowly to ever finish a cup? I certainly do. This is the right gift for someone that needs a hot cup of Joe and a little room on their desk.",
    //         product_base_price: 99.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef,technology",
    //         tags: "coffee,technology",
    //         tags_sort: "coffee,technology",
    //         tags_display: "technology,coffee",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61Qy-bK+M9L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100142,
    //         score: 0.9195656755587376,
    //         product_name: "Kasa Smart Plug",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/TP-Link-Kasa-Smart-Wifi-Plug/dp/B07RCNB2L3?th=1&linkCode=li2&tag=giftology02-20&linkId=bc353fa0163492b1594d95564fde1ffd&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07RCNB2L3&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07RCNB2L3" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3nA25aq",
    //         flavor_text:
    //           "Turn any device into a smart device with these handy plugs, which work with any major digital assistant.",
    //         lab_results:
    //           "Lab Results: This is one where you need to know your recipient. The use case is somewhere in their home there is a device that needs to be turned on/off utilizing a smart phone. If there is a pull string lamp somewhere that is their nemesis, you can be their hero.",
    //         product_base_price: 29.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "technology,homeOffice",
    //         tags: "practical,technology",
    //         tags_sort: "practical,technology",
    //         tags_display: "technology,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51j980zl6ML._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100145,
    //         score: 0.9108956437026178,
    //         product_name:
    //           "HP DeskJet 3755 Compact All-in-One Wireless Printer with Mobile Printing",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/HP-DeskJet-Wireless-Printing-Replenishment/dp/B07KX7B3TZ?keywords=hp%2Bdeskjet%2B3755&qid=1644019873&s=electronics&sprefix=hp%2Bdeskjet%2Celectronics%2C258&sr=1-1-spons&smid=A3DQ4XWQH1AL2Z&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyTVBHMFFRVDdLNERMJmVuY3J5cHRlZElkPUEwMjYwMjg4MzRPNDVYVTg2OFlMWSZlbmNyeXB0ZWRBZElkPUEwMjgyMjUxMjczQVVZNDZFWE9JRiZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU&th=1&linkCode=li2&tag=giftology02-20&linkId=9d51e5b226b4517f8e49b2dbbcdce561&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07KX7B3TZ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07KX7B3TZ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3ZGSf44",
    //         flavor_text:
    //           "So, you're finally committing to a printer in your home? This one is lightweight, wireless enabled, looks great, and is delightfully easy to set up.",
    //         lab_results:
    //           "Lab Results: Here's the thing, printers pretty much suck. They are difficult to set up, difficult to use, and add ink to the ever-growing list of things that can run out at the last minute. This DeskJet does its best to eliminate those first two problems, setting up quickly and paring nicely with multiple devices. If you're like us and can no longer bum off the office computer this is a nice way to round out your work from home setup.",
    //         product_base_price: 99.9,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "technology,homeOffice",
    //         tags: "practical,technology",
    //         tags_sort: "practical,technology",
    //         tags_display: "technology,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/819bRm8kwnL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100113,
    //         score: 0.9043790706676655,
    //         product_name: "Sony Wireless Overhead Headphones ",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Sony-WH-1000XM4-Canceling-Headphones-phone-call/dp/B0863TXGM3?crid=1FZ8W8Q9B02KZ&keywords=sony%2Bwireless&qid=1643409765&sprefix=sony%2Bwireles%2Caps%2C157&sr=8-4&th=1&linkCode=li2&tag=giftology02-20&linkId=46fe9925251a921427ab1205f2c11a8b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0863TXGM3&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0863TXGM3" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40VyHdd",
    //         flavor_text:
    //           "Our favorite overhead headphones for the audiophile in your life.",
    //         lab_results:
    //           "Lab Results: They're on the pricey side relative to some of the other items we recommend, but these headphones are top of the line in terms of noise cancelling and sound quality. If there is an audiophile in your life, they'll be thrilled to get a pair of these.",
    //         product_base_price: 349.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "technology,homeOffice,music",
    //         tags: "music,technology",
    //         tags_sort: "music,technology",
    //         tags_display: "technology,music",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71o8Q5XJS5L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100144,
    //         score: 0.876725949064069,
    //         product_name: "TP-Link AV600 Powerline Ethernet Adapter",
    //         category: "Home Office",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B00AWRUICG?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=d0ae930dbbc39c2289c8d0f0ab80c8f1&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00AWRUICG&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00AWRUICG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3Kpz5ex",
    //         flavor_text:
    //           "Our favorite solution for anyone that needs faster internet speeds, these adapters run your internet through your electrical grid allowing for a LAN connection anywhere you have a power source. Never use Wi-Fi again!",
    //         lab_results:
    //           "Lab Results: These aren't flashy but they're extremely functional. That said, for the right audience something that makes one of the only downsides of working from home a little easier is a solid gift.",
    //         product_base_price: 39.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "technology",
    //         tags: "practical,homeOffice,technology",
    //         tags_sort: "practical,homeOffice,technology",
    //         tags_display: "homeOffice,practical,homeOffice",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/6133cJRpEoL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100141,
    //         score: 0.8717650165249908,
    //         product_name: "Echo Show 8",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Echo-Show-8-2nd-Gen-2021-release/dp/B084DCJKSL?crid=33YGEIJ8CWA8Q&keywords=echo+show&qid=1644028924&s=amazon-devices&sprefix=echo+show%2Camazon-devices%2C91&sr=1-1&linkCode=li2&tag=giftology02-20&linkId=b04141878dccd13f3d23990cc0a4c9bd&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B084DCJKSL&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B084DCJKSL" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3M5TPJx",
    //         flavor_text: "The next step for the Alexa-enabled household.",
    //         lab_results:
    //           "Lab Results: Part smart assistant, part photo album. We really like our little Echo's and this kicks it up a notch with better speakers and a handy touchscreen. For an extra burst of thoughtfulness, pre-program it with family photos for a few extra points.",
    //         product_base_price: 129.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "technology,homeOffice",
    //         tags: "music,technology",
    //         tags_sort: "music,technology",
    //         tags_display: "technology,music",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61qCVjklDCL._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100036,
    //         score: 0.8712268440020476,
    //         product_name: "All-new Kindle Paperwhite",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/All-new-Kindle-Paperwhite-adjustable-Ad-Supported/dp/B08KTZ8249?dchild=1&keywords=kindle&qid=1635208726&qsid=146-2465125-7697967&sr=8-4&sres=B07745PV5G%2CB07978J597%2CB08B495319%2CB08KTZ8249%2CB07KR2N2GF%2CB07HSL23CW%2CB075RNKT6G%2CB07746ZX4Y%2CB07FJ91TLB%2CB07NQKJVKR%2CB08WPB8PW9%2CB07L5GDTYY%2CB077448K76%2CB07F81WWKP%2CB07741S7Y8%2CB075QRWPPJ&th=1&linkCode=li2&tag=giftology02-20&linkId=7c6f8c54a56770487b5fbff1ee472bef&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08KTZ8249&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08KTZ8249" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/41aV92b",
    //         flavor_text:
    //           "Folks who want to give the gift of a few good books – and a convenient way to read them.",
    //         lab_results:
    //           "Lab Results: This is another one that I wanted to dislike, as I love books and the feel and scent of the paper that comes with them. That said, I'm reading far more now that I've picked up a Kindle. There's something about having dozens of books at your fingertips that makes it easier to roll right into the next one without taking a break. Also, if you're looking for an alternative to scrolling on your phone before bed we strongly recommend picking one up. Sure, it's still a screen, but E Ink somehow feels healthier than staring at your phone. ",
    //         product_base_price: 139.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "reading,technology",
    //         tags: "essential,upgrade,books,technology",
    //         tags_sort: "books,technology,indoors",
    //         tags_display: "reading,essential,upgrade",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61P+vrvFZ9L._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100127,
    //         score: 0.8199315306452231,
    //         product_name: "Anker Portable Charger",
    //         category: "Travel",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Anker-PowerCore-Technology-High-Capacity-Compatible/dp/B07S829LBX?keywords=Anker%2BPortable%2BCharger&qid=1651341292&sr=8-5&th=1&linkCode=li2&tag=giftology02-20&linkId=d05590df7ad6381da400b4cdd3229185&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07S829LBX&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07S829LBX" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U3ynqD",
    //         flavor_text: "For the techy on the go.",
    //         lab_results:
    //           "Lab Results: This is the perfect gift for someone that likes to travel or your friends at the office. The Anker can charge an iPhone 11 up to 4 times. It is functional, sleek, and useful.",
    //         product_base_price: 42.97,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "technology",
    //         tags: "essential,portable,travel,technology",
    //         tags_sort: "travel,technology,practical",
    //         tags_display: "travel,essential,portable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71rC6tBu0NL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100191,
    //         score: 0.7455437569280274,
    //         product_name: "PopSockets Phone Grip",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/PopSockets-PopGrip-Swappable-Phones-Tablets/dp/B087ND59VF?crid=3MODF9VZ8SGTG&keywords=PopSockets+PopGrip&qid=1690503039&sprefix=popsockets+popgrip%2Caps%2C187&sr=8-15&linkCode=li3&tag=giftology02-20&linkId=8fa25c2018283fed4eac620ac62658e8&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B087ND59VF&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B087ND59VF" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/47aazaI",
    //         flavor_text: "Anyone looking to add a little flair to their phone.",
    //         lab_results:
    //           "Lab Results: These are light weight, look cool, and genuinely useful. Pick one up and you'll end up wanting more.",
    //         product_base_price: 12.49,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "music,technology",
    //         tags: "artsy,organized,trendy",
    //         tags_sort: "artsy,organized,trendy",
    //         tags_display: "artsy,organized,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61y2c7af8TL._AC_SL1087_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100189,
    //         score: 0.735237202272123,
    //         product_name: "Fujifilm Instax Mini 12",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B0BWNZLQ69?_encoding=UTF8&psc=1&linkCode=li2&tag=giftology02-20&linkId=8873a70371b4eb6108247a321b8cc70c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BWNZLQ69&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0BWNZLQ69" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/454yNkM",
    //         flavor_text: "Someone who knows how to capture a moment.",
    //         lab_results:
    //           "Lab Results: This trendy instant camera allows users to capture and print photos instantly. It comes with automatic exposure, a selfie mode, and various color options, making it a stylish and fun gift for a quirky and trend-conscious girl.",
    //         product_base_price: 78.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts,technology",
    //         tags: "artsy,creative,practical,trendy",
    //         tags_sort: "artsy,creative,practical",
    //         tags_display: "artsAndCrafts,creative,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51T3ZomxaCL._AC_SL1200_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 162,
    //         score: 0.7146909527450058,
    //         product_name: "Womens Oversized Half Zip Pullover",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B0BBFYCQJT?&linkCode=li3&tag=giftology02-20&linkId=752017408ca8ff1bb99436fb2c843300&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BBFYCQJT&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0BBFYCQJT" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/43JCGui",
    //         flavor_text: "When you want to be warm and comfy.",
    //         lab_results:
    //           "Lab Results:  This comfy half zip is both practical and trendy.",
    //         product_base_price: 42.99,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "music,technology",
    //         tags: "trendy,durable,travel",
    //         tags_sort: "trendy,travel",
    //         tags_display: "travel,trendy,durable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81O6ERy19CL._AC_UX569_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100190,
    //         score: 0.6913476823991676,
    //         product_name: "5-Minute Gratitude Journal",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/5-Minute-Gratitude-Journal-Nanea-Press/dp/B0C9S5HMP5?keywords=The+Five-Minute+Journal&qid=1690502142&sr=8-9&linkCode=li3&tag=giftology02-20&linkId=af1d87137ac3ed5814ba2a91a6d787f8&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0C9S5HMP5&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0C9S5HMP5" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3QgU8TH",
    //         flavor_text: "Couldn't we all be a little more mindful?",
    //         lab_results:
    //           "Lab Results: A journal designed to cultivate gratitude and focus on the positive aspects of life.",
    //         product_base_price: 12.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts,healthAndWellness",
    //         tags: "artsy,creative,practical,trendy",
    //         tags_sort: "artsy,creative,practical",
    //         tags_display: "artsAndCrafts,creative,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61MIFKqF+lL.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100033,
    //         score: 0.6505212069454234,
    //         product_name: "Fitbit Charge 5",
    //         category: "Health And Wellness",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B09BXQ4HMB?ascsubtag=%5Bartid%7C2089.g.362%5Bsrc%7C%5Bch%7C%5Blt%7Csale&linkCode=li2&tag=giftology02-20&linkId=7655e88de7392009d225ed2b99302009&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09BXQ4HMB&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09BXQ4HMB" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3Zzqjic",
    //         flavor_text:
    //           "Whether you’re out and about or remaining cautious, a Fitbit can help you get your physical health back on track.",
    //         lab_results:
    //           "Lab Results: This is the smart watch for when you want to get in shape. The Charge 5 does an excellent job of automatically detecting when a workout has begun, as well as divvying up your exercise time into what it calls Active Zone Minutes; time spent between fat burning, cardio, and peak workouts. We particularly enjoy the sleep tracking features, monitoring sleep duration as well as gauging your restlessness throughout the night. There's a very good chance you'll go from couch potato to stomping around your house because you are 200 steps shy of your 10,000 step goal.\n\nThis is our generalist pick, but if you dead set on running a marathon we do recommend the ~~ID=“100140” text=“Garmin Forerunner”~~.",
    //         product_base_price: 149.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "healthAndWellness,technology",
    //         tags: "athletic,healthNut",
    //         tags_sort: "athletic,outdoors",
    //         tags_display: "healthAndWellness,athletic,healthNut",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/41iag5vRGVL._AC_SL1001_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100203,
    //         score: 0.6183786325109307,
    //         product_name: "Eat Pasta Run Fasta T-shirt",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/966963376/eat-pasta-run-fasta-shirt-pasta-shirt?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=al+dente+shirt&ref=sc_gallery-1-8&pro=1&plkey=15cbd79db01c0a6d0b72a21a8d402e66509500c3%3A966963376",
    //         flavor_text:
    //           "Pasta lovers, carb-loading champions, and those who believe in the power of carbs to fuel their inner speed demon.",
    //         lab_results:
    //           "Lab Results: Embrace your love for both pasta and pavement-pounding with this cheeky tee. It's a culinary and athletic mashup that celebrates the carb-filled joy of life. Perfect for runners who carb-load like champs, this shirt will make you the talk of the track. Slip it on and let your shirt do the talking while you conquer miles and plates of spaghetti with equal gusto.",
    //         product_base_price: 11.9,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "homeChef,healthAndWellness",
    //         tags: "athletic,italian,fun",
    //         tags_sort: "athletic",
    //         tags_display: "athletic,italian,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/28231934/r/il/b23d1c/2989132325/il_fullxfull.2989132325_m7be.jpg",
    //         listing_id: 966963376,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 7,
    //         score: 0.6165064674599451,
    //         product_name: "AeroGarden Sprout",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/AeroGarden-Sprout-White/dp/B08GV19MKH?th=1&linkCode=li2&tag=giftology02-20&linkId=7d27a87e020fa53aa8729fe4049d4739&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08GV19MKH&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08GV19MKH" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42WWnQ4",
    //         flavor_text: "People who desperately need fresh pesto year-round.",
    //         lab_results:
    //           "Lab Results: Have a green thumb, but live in a high-rise apartment or have Winters that are just too cold? This is how you keep fresh herbs in the house all year round. Surprisingly easy to set up, and otherwise extremely hands off, this device is a fun, easy way to garden indoors. We've found that roughly two basil plants are enough to make sure we can have pesto every few weeks even in the Winter, and our one dill plant grows so fast we've had to get creative just to use it all.",
    //         product_base_price: 99.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef,technology,gardening",
    //         tags: "creative,science",
    //         tags_sort: "creative",
    //         tags_display: "homeChef,creative,science",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81rn6RoUg3L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 190,
    //         score: 0.6148984713261253,
    //         product_name: "One More Chapter Mug",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/YouNique-Designs-Chapter-Librarian-Bookworm/dp/B0BXWWW1P8?crid=1CUSOACNUZ7N2&keywords=one%2Bmore%2Bchapter%2C%2Bmug&qid=1692463957&sprefix=one%2Bmore%2Bchapter%2C%2Bmug%2Caps%2C128&sr=8-2&th=1&linkCode=li3&tag=giftology02-20&linkId=681b3edd4f0b0cfe2802930b6b64f519&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BXWWW1P8&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0BXWWW1P8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3OJbbvd",
    //         flavor_text:
    //           "Bookworms, night owls, and those who find solace in literary journeys.",
    //         lab_results:
    //           "Lab Results: Wrap your hands around this mug, perfect for cozy reading nights. It's a promise that one more chapter is always within reach. Sip and immerse!",
    //         product_base_price: 17.97,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "reading",
    //         tags: "reading,coffee,tea",
    //         tags_sort: "reading,coffee,tea",
    //         tags_display: "coffee,tea",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71f8WePympL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100197,
    //         score: 0.6105053133003322,
    //         product_name: "Loop Ear Plugs",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Loop-Experience-Noise-Reduction-Plugs/dp/B08TCH6CVB?&linkCode=li3&tag=giftology02-20&linkId=fe91f169cfef1d80b4fd2419eddbfa0a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08TCH6CVB&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B08TCH6CVB" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3OWIn3U",
    //         flavor_text: "The concert goer.",
    //         lab_results:
    //           "Lab Results:  Fashion and quality aren't necessarily what you think of when discussing your health, but these little ear buds delivery both. They are comfortable, functional, and a great way to protect your hearing.",
    //         product_base_price: 34.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "music,technology",
    //         tags: "music",
    //         tags_sort: "music",
    //         tags_display: "music,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51XWq+KyMiL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 203,
    //         score: 0.5993223990303861,
    //         product_name: "Herbology Sweater",
    //         category: "Gardening",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Harry-Potter-Herbology-Plants-Sweatshirt/dp/B08D24PK95?crid=2KT8R81YB8O3E&keywords=herbology+seater&qid=1692464713&sprefix=herbology+seate%2Caps%2C115&sr=8-11&linkCode=li3&tag=giftology02-20&linkId=c699ba01a347394e7a15b6d90cea8ba1&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08D24PK95&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B08D24PK95" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3KJh1vF",
    //         flavor_text:
    //           "Plant lovers, nature enthusiasts, and those who find magic in the world of herbs.",
    //         lab_results:
    //           "Lab Results: Wrap yourself in herbal enchantment with this sweater. Embrace the art of Herbology and wear your plant passion with cozy style. Channel the magic of nature!",
    //         product_base_price: 42.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening,reading",
    //         tags: "gardening,reading,nerdy",
    //         tags_sort: "gardening,reading,nerdy",
    //         tags_display: "gardening,reading,nerdy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/B18zCiKmq+S._CLa%7C2140%2C2000%7CB1vJC6uP4mL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UX466_.png",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100011,
    //         score: 0.5918335113770767,
    //         product_name: "SodaStream Fizzi Sparkling Water Maker",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B01HW6P4TQ?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=f0bd113897a23428ed66bb32b5454330&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01HW6P4TQ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01HW6P4TQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3K4SiR5",
    //         flavor_text:
    //           "Anyone looking to spice up their dinner parties, drink healthy, or always forget the mixers.",
    //         lab_results:
    //           "Lab Results: There's a surprising amount of versatility to this little device. The SodaStream folks have all sorts of recipes and flavorings to make exciting fizzy water, but don't forget how many cocktails call for a splash of soda. If you're like us, it's also just a great way to up your water intake without adding a lot of sugar and caffeine to your diet.",
    //         product_base_price: 86.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "homeChef,mixology",
    //         tags: "fun",
    //         tags_sort: "indoors,delicious,eco-friendly",
    //         tags_display: "homeChef,fun,eco-friendly",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61LI6F6cy9L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100125,
    //         score: 0.5861922632788635,
    //         product_name: "Robotime Gramophone",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/ROBOTIME-Classic-Gramophone-Hand-Cranking-3-Speed/dp/B08P5NCZR1?th=1&linkCode=li2&tag=giftology02-20&linkId=4f4c926012b4cad1336b4afab74de66e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08P5NCZR1&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08P5NCZR1" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40Afiyx",
    //         flavor_text:
    //           "If they like working with their hands and old timey vinyl music, we can't imagine a better mashup.",
    //         lab_results:
    //           "Lab Results: There is a joy to be had in building something as unusual as a gramophone to find that it actually works. This one works for kids interested in science and adults interested in music. ",
    //         product_base_price: 84.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy,music",
    //         tags_sort: "creative,handy,music",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/7181NrVCSDL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "Y",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100081,
    //         score: 0.5794991630099786,
    //         product_name: "What If?",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/What-If-Scientific-Hypothetical-Questions-ebook/dp/B00IYUYF4A?crid=2PV9NY5KOOGJR&keywords=what+if&qid=1642368318&sprefix=what+if%2Caps%2C111&sr=8-3&linkCode=li2&tag=giftology02-20&linkId=27df3b6ee7fdca334e614a6792d80ffa&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00IYUYF4A&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00IYUYF4A" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42VLGxb",
    //         flavor_text:
    //           "Fans of xkcd, precocious children, and anyone that loves to chase a shower thought down a rabbit hole.",
    //         lab_results:
    //           "Lab Results: If you are a fan of the popular xkcd comics, why not try the book? Randal Monroe brings his signature blend of humor and rigorous analysis to solving some of the most unusual questions he's gotten in his career.",
    //         product_base_price: 15.87,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "reading",
    //         tags: "nerdy,science,books",
    //         tags_sort: "nerdy,books,indoors",
    //         tags_display: "reading,nerdy,science",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51PdzumjQFL.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100014,
    //         score: 0.5667501619372639,
    //         product_name: "JBL CLIP 3",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/JBL-Waterproof-Portable-Bluetooth-Speaker/dp/B07Q6ZWMLR?th=1&linkCode=li2&tag=giftology02-20&linkId=12a96101cb164b03647bd84089a58e35&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07Q6ZWMLR&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07Q6ZWMLR" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3JUlQ40",
    //         flavor_text: "Beachgoers, bike riders, and hikers.",
    //         lab_results:
    //           "Lab Results: For those of you who either want a budget-friendly version of the ~~ID=“100013” text=“JBL FLIP 5”~~or an even more portable alternative, we recommend the JBL CLIP 3. This little device has surprisingly great sound quality, easy to use Bluetooth pairing, and ten hours of battery life. It's durable too, we've had one for years that keeps on kicking despite being into backpacks, bags, and stuff sacks.",
    //         product_base_price: 49.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "music,technology",
    //         tags: "music",
    //         tags_sort: "music",
    //         tags_display: "technology,music",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81DWevC1klL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100157,
    //         score: 0.5623947889145917,
    //         product_name: "Buddha Board",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Original-Buddha-Board-Relaxing-Painting/dp/B0010TEFFQ?hvadid=194877134619&hvpos=&hvnetw=g&hvrand=437511892443034005&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9021716&hvtargid=pla-312892438555&psc=1&linkCode=li2&tag=giftology02-20&linkId=2887b204a37bf824f3b578d4c25e8a7e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0010TEFFQ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0010TEFFQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3ZxIbKu",
    //         flavor_text:
    //           "People looking for a moment of Zen, anytime they need it.",
    //         lab_results:
    //           "Lab Results: Relaxing and easy to use water board to help relieve stress, this is like a grown-up version of the magic erase board. Using only water and the provided paint brush, make any  image that you like that will fade away as it dries, ready for your next doodle.",
    //         product_base_price: 37.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "artsy,creative,thoughtful",
    //         tags_sort: "artsy,creative,indoors",
    //         tags_display: "artsAndCrafts,creative,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/813H5b9wXYL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100078,
    //         score: 0.5511130755771184,
    //         product_name: "Yoda Heavy-Duty Bookend",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Premium-Heavy-Duty-Metal-Bookend-L-Shaped/dp/B07LD9GY3J?crid=1JHX7C4E1ZNEU&keywords=bookends&qid=1642366029&sprefix=bookends%2Caps%2C168&sr=8-14&th=1&linkCode=li2&tag=giftology02-20&linkId=be96e9f02af3ff2e60d46689547e65fb&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07LD9GY3J&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07LD9GY3J" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3nBQXKj",
    //         flavor_text: "Hold up your books, you must.",
    //         lab_results:
    //           "Lab Results: We have a handful of bookends on the website because we think they make for a great unexpected gift, particularly in an era where everyone is judging the books on your shelves in the background of a Zoom meeting. \n\nIf they have ever tried to use the Force, and who hasn't, this is our recommendation. Otherwise here's one with ~~ID=“100180” text=“chess pieces”~~ and another with ~~ID=“100177” text=“cute cats”~~.",
    //         product_base_price: 27.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "reading",
    //         tags: "nerdy,books",
    //         tags_sort: "nerdy,books,indoors",
    //         tags_display: "reading,nerdy,books",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51IhSeffnPL._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100175,
    //         score: 0.5464595499828669,
    //         product_name: "Woobles Beginner Crochet Kit",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Woobles-Beginner-Crochet-All-One/dp/B08YS42GPG?keywords=the+woobles+beginner+crochet+kit&qid=1658083575&sprefix=the+woobles+be%2Caps%2C82&sr=8-2&linkCode=li2&tag=giftology02-20&linkId=79be915c9977e58cd8545eca6b6ac403&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08YS42GPG&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08YS42GPG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3TZQe1m",
    //         flavor_text:
    //           "Great for beginners, but equally great for the crocheter that is burnt out making scarves.",
    //         lab_results:
    //           'Lab Results: These little kits are adorable, and excellent for beginners. By the time you are done with one a beginner will be able to say they "get" how to crochet, and that is enough to make it a good gift. Yet we can dig deeper. \n\nLearning to crochet seems to come in waves. You make a few simple items, maybe throw a new pattern into a scarf, and then take a break searching for inspiration. These kits are the perfect way to rekindle the original sensation of learning a new hobby. If you know someone stuck in a rut, you can rekindle their spark. That\'s an outstanding gift.',
    //         product_base_price: 34.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "artsy,creative,thoughtful",
    //         tags_sort: "artsy,creative,indoors",
    //         tags_display: "artsAndCrafts,creative,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81sVlNkA2EL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100070,
    //         score: 0.5440825813719363,
    //         product_name: "Pandemic Legacy",
    //         category: "Board Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Pandemic-Cooperative-Playtime-Z-Man-Games/dp/B00TQ0DXR2?crid=3KNLIGAJUVH1P&keywords=pandemic+legacy&qid=1642357195&sprefix=pandemic+legac%2Caps%2C251&sr=8-2&linkCode=li2&tag=giftology02-20&linkId=28dee0393a2125c52f86f6850a057ff5&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00TQ0DXR2&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00TQ0DXR2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3KpxxRL",
    //         flavor_text:
    //           "Anyone stuck at home during a pandemic, so everyone really.",
    //         lab_results:
    //           "Lab Results: This game is so good you've probably already heard of it, but we think it makes a strong entry into board game night. Our favorite element is that the game inherently involves teamwork, with all players working to save the world. If that's more your speed than a competitive outing, we highly recommend it.",
    //         product_base_price: 79.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "boardGames",
    //         tags: "competitive,nerdy",
    //         tags_sort: "competitive,nerdy",
    //         tags_display: "boardGames,competitive,nerdy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/91pULhz5QyL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100202,
    //         score: 0.5430086996316583,
    //         product_name: "Hygge Gift Box",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1510508511/hygge-gift-box-with-blanket-thank-you?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=coffee&ref=sr_gallery-1-1&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Someone that needs to focus on their wellbeing, or just misses Denmark.",
    //         lab_results:
    //           "Lab Results: Hygge is the Danish word for a mood of coziness and contement, and this gift is sure to make them feel that way.",
    //         product_base_price: 34.65,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts,healthAndWellness",
    //         tags: "bathAndBody",
    //         tags_sort: "bathAndBody",
    //         tags_display: "healthAndWellness, comfy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/22152625/r/il/9353d5/4893870039/il_fullxfull.4893870039_oi39.jpg",
    //         listing_id: 1510508511,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100219,
    //         score: 0.5422700755361094,
    //         product_name: "Sunflower String Kit",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/BAZIMA-String-Beginner-string-Holidays/dp/B09L6ZD65G?keywords=BAZIMA+ALICE&qid=1692398085&sr=8-2&linkCode=li3&tag=giftology02-20&linkId=c4827178728d90b0dbed864a0c5e1c13&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09L6ZD65G&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B09L6ZD65G" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/44iCnGW",
    //         flavor_text:
    //           "Craft enthusiasts, sunflower lovers, and those seeking a creative way to brighten their space.",
    //         lab_results:
    //           "Lab Results: Craft your own sunflower masterpiece with this kit. String art meets floral charm, letting you weave sunshine into your decor. Get ready to bloom artistically!",
    //         product_base_price: 14.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "artsy,creative,thoughtful",
    //         tags_sort: "artsy,creative,indoors",
    //         tags_display: "artsAndCrafts,creative,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61LzeNLs+WL._AC_SL1200_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100181,
    //         score: 0.5409484002915717,
    //         product_name: "Moleskine Classic Notebook",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/8883707206?ots=1&slotNum=135&imprToken=aac1a6cf-b44a-4ef5-ab9&ascsubtag=%5B%5Dst%5Bp%5Dcjamukaca0034o8y6zxtatgdz%5Bi%5DdDN9JZ%5Bu%5D2%5Bt%5Dw%5Br%5Dgoogle.com%5Bd%5DD%5Bz%5Dm&th=1&linkCode=li2&tag=giftology02-20&linkId=e3f5bab87375f139cbee1b52d870602f&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=8883707206&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=8883707206" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/431Hiwz",
    //         flavor_text:
    //           "Note takers, sketch artists, cartoonists, and anyone that just prefers to write with a pen.",
    //         lab_results:
    //           "Lab Results: As far as quality notebooks go, these are top of the heap. The cover feels divine, the paper is high quality, and the elastic band never wears out.",
    //         product_base_price: 18.56,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "artsy,creative,practical",
    //         tags_sort: "artsy,creative,practical",
    //         tags_display: "artsAndCrafts,creative,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71idh1nhU9L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100151,
    //         score: 0.5390295593456356,
    //         product_name: "Lamy Safari Fountain Pen",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B0002T401Y?&linkCode=li2&tag=giftology02-20&linkId=a67148f46fbb037f9d11c0226ea29491&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0002T401Y&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0002T401Y" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3M8Wxh9",
    //         flavor_text:
    //           "Aspiring sketch artists, amateur doodlers, and those who appreciate a truly pleasurable writing experience. A superb pen for the money.",
    //         lab_results:
    //           "Lab Results: We recommend this as your first fountain pen, and in most cases this is the only one you'll ever need. If all you've used before is a standard ballpoint pen, you're in for a treat, writing with this pen is butter smooth, a truly pleasurable experience. \n\nThis gift is the perfect pairing for a ~~ID=“100152” text=“Midori notebook”~~.",
    //         product_base_price: 35.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "artsy,creative,practical",
    //         tags_sort: "artsy,creative,practical",
    //         tags_display: "artsAndCrafts,creative,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51G+hOPD0yL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100013,
    //         score: 0.5367384212031123,
    //         product_name: "JBL FLIP 5",
    //         category: "Technology",
    //         html_tag:
    //           '<a href="https://www.amazon.com/JBL-Waterproof-Portable-Bluetooth-Speaker/dp/B07QK2SPP7?th=1&linkCode=li2&tag=giftology02-20&linkId=ac8a86b134ee6aa3c8e01f6136d72b65&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07QK2SPP7&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07QK2SPP7" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3TZFTCG",
    //         flavor_text:
    //           "For those who consider music an important part of their daily routine, we recommend the JBL family of portable Bluetooth speakers.",
    //         lab_results:
    //           "Lab Results: The FLIP 5 is a robust speaker system, offering great battery life and sound quality. Indoors or outdoor play, feel free to set this one up in your office or take it out to the beach. Bluetooth pairing works without a hitch.\n\nLike the idea but looking for something more affordable and portable? Check out the ~~ID=“100014” text=“JBL CLIP 3”~~.",
    //         product_base_price: 129.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "music,technology",
    //         tags: "music",
    //         tags_sort: "music",
    //         tags_display: "technology,music",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71FyNyR1MJL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100152,
    //         score: 0.5352022921350026,
    //         product_name: "Midori MD Notebook",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B003CT47YG?th=1&linkCode=li2&tag=giftology02-20&linkId=2f42f213660f1c633d8f2db46e75ddbe&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B003CT47YG&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B003CT47YG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U541Ur",
    //         flavor_text:
    //           "Anyone looking for a top quality journal or sketch book with top quality paper guaranteed to stand up to almost any ink. Pairs nicely with a quality fountain pen.",
    //         lab_results:
    //           "Lab Results: The lay flat design and subtle roughness make sketching in this notebook a joy. The paper is of sufficient quality to stan up to almost any ink you can throw at it. Important note, this is an A6 size notebook so it is on the smaller side, which in this case we think is a plus.\n\nThis gift is the perfect pairing for a ~~ID=“100151” text=“Lamy Fountain Pen”~~.",
    //         product_base_price: 8.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "artsy,creative,practical",
    //         tags_sort: "artsy,creative,practical",
    //         tags_display: "artsAndCrafts,creative,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51IG-cpHYrL._AC_SL1001_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100117,
    //         score: 0.5301861793053391,
    //         product_name: "Wood Burning Kit",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Adjustable-Temperature-200-450%C2%B0C-Pyrography-Embossing/dp/B08GX8FNBT?crid=21EY7ULOAJDAK&keywords=diy&qid=1644004999&sprefix=diy%2Caps%2C164&sr=8-12&linkCode=li2&tag=giftology02-20&linkId=e34a5c5c7f0f5c7bd81448024c975188&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08GX8FNBT&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08GX8FNBT" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3nFirPf",
    //         flavor_text:
    //           "Anyone looking for a new hobby that enjoys working with their hands.",
    //         lab_results:
    //           "Lab Results: This is kind of an unexpected gift, but once you get your hands on one you won't want to put it down. We recommend this gift for someone that is particularly crafty, maybe already getting into the world of woodworking, and wants to take things to the next level.",
    //         product_base_price: 19.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71InXOxdo3L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100123,
    //         score: 0.5282086169538465,
    //         product_name: "Robotime Monocular Telescope Kit",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/ROBOTIME-Puzzles-Wooden-Monocular-Telescope/dp/B09879LG27?crid=258Y14PKPCJGL&keywords=robotime+telescope&qid=1669578731&s=toys-and-games&sprefix=robotime+telescope%2Ctoys-and-games%2C83&sr=1-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExUjdVVFpaMjNFNUlaJmVuY3J5cHRlZElkPUEwODk0MDI4M0JLRlRQS1pIWFk1UCZlbmNyeXB0ZWRBZElkPUEwOTUxNjUyMzVWUEE3QzJJRFVaQSZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU%3D&linkCode=li2&tag=giftology02-20&linkId=aca26455441300f1d815b9c0f167531c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09879LG27&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09879LG27" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42ULyOp",
    //         flavor_text:
    //           "For those curious what's out there, and with the courage to find out.",
    //         lab_results:
    //           "Lab Results: We recommend this as a gift for someone that has gotten into LEGO, model planes, or anything else that snaps together. Good for early teens and offering a roughly 5 hour build time, this one leaves you with a finished product that is not only beautiful but functional.",
    //         product_base_price: 32.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71KWZBP1r2S._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "Y",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100122,
    //         score: 0.5265425786097178,
    //         product_name: "Robotime DIY Dollhouse",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/ROBOTIME-Dollhouse-Miniature-Furniture-Birthday/dp/B06W55GYG2?th=1&linkCode=li2&tag=giftology02-20&linkId=66731f267d53c91dbb62f18bd945a2c8&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B06W55GYG2&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B06W55GYG2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40ypuYq",
    //         flavor_text:
    //           "Working on this little structure is a surprisingly Zen-like experience.",
    //         lab_results:
    //           "Lab Results: The joy of this one is the intricacy of all the items in the dollhouse. We recommend it for kids that have grown up from their childhood dollhouse but wish that hadn't.",
    //         product_base_price: 39.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81ENPbCTK+L._AC_SL1200_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "Y",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100200,
    //         score: 0.5248537071123246,
    //         product_name: "Yoshi - But First Coffee",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Womens-Nintendo-Coffee-V-Neck-T-Shirt/dp/B07SXJR3JD?keywords=but+first+coffee+shirt&qid=1692279636&sprefix=but+first+coffee%2Caps%2C123&sr=8-16&linkCode=li3&tag=giftology02-20&linkId=828d2931e7d985e5008f152053ab00b0&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07SXJR3JD&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B07SXJR3JD" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3QL3oQl",
    //         flavor_text: "Someone that feelsl like they need to grab a star.",
    //         lab_results:
    //           "Lab Results:  Whether they are a gamer or just a fan of caffeine, this will put a smile on their face.",
    //         product_base_price: 24.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gaming",
    //         tags: "gaming,coffee,nerdy",
    //         tags_sort: "gaming,coffee,nerdy",
    //         tags_display: "gaming,coffee,nerdy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/B1NTkDiyFlS._CLa%7C2140%2C2000%7C81yIPN6dxbL.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_UX679_.png",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100115,
    //         score: 0.5206182947506921,
    //         product_name: "Robotime 3D Wooden Luminous Globe",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B09C7R2YY9?_encoding=UTF8&aaxitk=a9feca0cd59d9cc4dc7a3d974ae98532&hsa_cr_id=5566316340301&pd_rd_plhdr=t&pd_rd_r=60cf4ccc-799e-4e87-978c-3daaced8abff&pd_rd_w=5kcmh&pd_rd_wg=Cbf7P&linkCode=li2&tag=giftology02-20&linkId=0af3439cee06d9d4efbd0ed2df3d6214&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09C7R2YY9&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09C7R2YY9" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3G9C34g",
    //         flavor_text: "Craftsman looking for their inner cartographer.",
    //         lab_results:
    //           "Lab Results: Having a globe in your room is pretty cool, and even cooler when you build one yourself. This light up globe only takes about 5 hours to make. It might be a little challenging for kids, so we recommend a build-together project, but teenagers will be able to handle it just fine.\n\nLooking for something a little more advanced? Try this ~~ID=“100116” text=“marble run”~~.",
    //         product_base_price: 53.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71ajdzjiLHL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "Y",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100118,
    //         score: 0.5204239417320373,
    //         product_name: "Complete DIY Candle Making Kit",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Complete-DIY-Candle-Making-Supplies/dp/B0885XVTGC?crid=21EY7ULOAJDAK&keywords=diy&qid=1644004999&sprefix=diy%2Caps%2C164&sr=8-9&linkCode=li2&tag=giftology02-20&linkId=782a5b7d420c5a4aa571a4ce4f8f195a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0885XVTGC&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0885XVTGC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3Ma46o6",
    //         flavor_text:
    //           "Looking for a Zen hobby that is the right combination of form and function? Consider candle making!",
    //         lab_results:
    //           "Lab Results: This candle making kit looks like it might be for kids, but we've had just as much fun with it as adults. There's a good chance you pick this up for your youngster only to find you've developed a new hobby of your own.",
    //         product_base_price: 49.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71kNrZqFitL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100218,
    //         score: 0.5187036119585072,
    //         product_name: "Leather Sketch Case",
    //         category: "Arts and Crafts",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1467387939/handmade-leather-artist-sketch-pad-case?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=arts+and+crafts&ref=sr_gallery-1-14&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Artistic souls, sketchbook enthusiasts, and creators who demand elegance in their tools.",
    //         lab_results:
    //           "Lab Results: Elevate your sketching experience with this leather case. It cradles your creativity in style, a haven for your sketchbook and tools. Unleash your artistic flair with sophistication.",
    //         product_base_price: 78.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "artsy,creative,practical",
    //         tags_sort: "artsy,creative,practical",
    //         tags_display: "artsAndCrafts,creative,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/15651958/r/il/0d9a5e/5638173349/il_fullxfull.5638173349_rgfa.jpg",
    //         listing_id: 1467387939,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100034,
    //         score: 0.5186079234664167,
    //         product_name: "Frank Herbert's Dune Saga Collection: Books 1 - 6",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Frank-Herberts-Dune-Saga-Collection-ebook/dp/B088QLJGZC?dchild=1&keywords=dune+box+set&qid=1635208554&qsid=146-2465125-7697967&sr=8-1&sres=B07WDM3D5T%2C0593201892%2C1250263352%2C0425052125%2CB001AT61PI%2CB09HRDJC8F%2CB07W9GCT9D%2C0441013597%2C0358653037%2C1419759469%2C0593098269%2C0593201744%2C0008260184%2C1101965487%2C1909306800%2C1473224462&linkCode=li2&tag=giftology02-20&linkId=355a354576ecf2c128d07fb69b5fa3b2&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B088QLJGZC&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B088QLJGZC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40Qon6b",
    //         flavor_text:
    //           "If they own one of these series, they will love the rest, and if they are just getting started in Sci-Fi they might as well start at the beginning.",
    //         lab_results:
    //           "Lab Results: A deep bit of nerd culture that has finally made it mainstream with 2021's feature film release, the Dune saga is one of the original great sci-fi epics. We do recommend it to anyone that enjoyed the movie, or even the 1984 version which is a wilder ride, but where this really shines as a great gift is for people that read the original back in the 60's but never had a chance to finish the set. It's also required reading for fans of Star Wars and Game of Thrones, both of which clearly draw inspiration from this series.",
    //         product_base_price: 54.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "reading",
    //         tags: "nerdy,books",
    //         tags_sort: "nerdy,books,indoors",
    //         tags_display: "reading,nerdy,books",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51Jgz5OshpL.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100139,
    //         score: 0.5146929097302176,
    //         product_name: "Anova Culinary Sous Vide Precision Cooker Nano",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Anova-Culinary-Precision-Bluetooth-Included/dp/B07C7PW3PC?th=1&linkCode=li2&tag=giftology02-20&linkId=fbe64eeb31dfdaf9c3ed0cb251e1b76c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07C7PW3PC&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07C7PW3PC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3lSyQiN",
    //         flavor_text:
    //           "Sous Vide is the solution for everyone from the beginner chef that always overcooks their chicken breasts to the pro looking to experiment with enhanced techniques.",
    //         lab_results:
    //           "Lab Results: There are so many applications for this thing. We recommend it for the foodie that is into the gastronomy side of things or the athlete that is tired of meal prepping.",
    //         product_base_price: 129,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "homeChef,technology",
    //         tags: "practical",
    //         tags_sort: "practical,indoors",
    //         tags_display: "homeChef,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61Kk5E3VQ6L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100156,
    //         score: 0.5057369317470215,
    //         product_name: "Blind Date With a Book",
    //         category: "Reading",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1045538079/blind-date-with-a-book-choose-your-genre?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=books&ref=sr_gallery-1-5&pop=1&sts=1&organic_search_click=1",
    //         flavor_text: "Do they like books, surprises, and cute packaging?",
    //         lab_results:
    //           "Lab Results: Perhaps the most popular product on the platform, we can't get over what a bargain this is. There is a real sense of excitement opening a totally unique and unexpected gift like this. The included hot beverage is a treat, the felling of helping a small business.",
    //         product_base_price: 11,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "reading",
    //         tags: "cozy,fun,thoughtful,books",
    //         tags_sort: "books,customizable,indoors",
    //         tags_display: "reading,unexpected,thoughtful",
    //         product_card_banner: "Most Popular",
    //         direct_image_src:
    //           "https://i.etsystatic.com/30718349/r/il/909d5c/3350418397/il_fullxfull.3350418397_qqjz.jpg",
    //         listing_id: 1045538079,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100124,
    //         score: 0.5025109695890234,
    //         product_name: "ROKR Music Box",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B08ML5XBL1?pd_rd_i=B08ML5XBL1&pf_rd_p=b000e0a0-9e93-480f-bf78-a83c8136dfcb&pf_rd_r=70MTEVW03K1CC1G1N70S&pd_rd_wg=VcoZq&pd_rd_w=6JWuH&pd_rd_r=bcae5ea8-fd6e-4df1-9b89-2ab577fa2090&linkCode=li2&tag=giftology02-20&linkId=e56ff91ed00d8b0230792903d8738558&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08ML5XBL1&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08ML5XBL1" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zpdBYT",
    //         flavor_text:
    //           "This little project is a great one for the young-adult crowd.",
    //         lab_results:
    //           "Lab Results: At the end of this build you'll have a fully functional rotating music box that looks like a model of the planets orbiting the sun.",
    //         product_base_price: 29.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 18,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71RKG2rjsbL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "Y",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100066,
    //         score: 0.4939266995806352,
    //         product_name: "TriggerPoint GRID Foam Roller",
    //         category: "Health And Wellness",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B0040EGNIU?ascsubtag=%5Bartid%7C2089.g.362%5Bsrc%7C%5Bch%7C%5Blt%7Csale&th=1&linkCode=li2&tag=giftology02-20&linkId=33910291cc017211d6a91f7e7dbef38b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0040EGNIU&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0040EGNIU" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40PO46M",
    //         flavor_text:
    //           "Someone that needs a massage but is too cheap to get one.",
    //         lab_results:
    //           "Lab Results: If getting into shape has brought its own aches and pains, this foam roller will help work things out. Workout items do make for a tricky gift though, as it's hard to tell who might really need on of these things. Still, if you're shopping for yourself, consider adding it to your Christmas list.",
    //         product_base_price: 39.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "healthAndWellness",
    //         tags: "athletic,healthNut",
    //         tags_sort: "athletic",
    //         tags_display: "healthAndWellness,athletic,healthNut",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81+vsqACYpL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100116,
    //         score: 0.4901929645797598,
    //         product_name: "Robotime 3D Wooden Marble Run",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B09498R8RN?_encoding=UTF8&aaxitk=a9feca0cd59d9cc4dc7a3d974ae98532&hsa_cr_id=5566316340301&pd_rd_plhdr=t&pd_rd_r=60cf4ccc-799e-4e87-978c-3daaced8abff&pd_rd_w=5kcmh&pd_rd_wg=Cbf7P&linkCode=li2&tag=giftology02-20&linkId=7b163b735b965040da45957dc05d7b26&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09498R8RN&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09498R8RN" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42V8gpI",
    //         flavor_text:
    //           "The fun doesn't stop after you've completed construction of this innovative marble run.",
    //         lab_results:
    //           "Lab Results: This is a great one to do along with your kids. It looks complex, but only takes about 7 hours to build. Our favorite thing about this one is that there is more excitement after the build, as cranking the marbles around is part of the fun.\n\nLooking for something a little simpler? Try this ~~ID=“100115” text=“rotating globe”~~.",
    //         product_base_price: 56.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 18,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71CUn1PIDkS._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "Y",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100174,
    //         score: 0.48332526337663057,
    //         product_name: "Knot Tying Kit",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Tying-Pro-Knot-Cards-practice-carabiner/dp/0922273294?hvadid=312674808447&hvpos=&hvnetw=g&hvrand=2433527030356455779&hvpone=&hvptwo=&hvqmt=&hvdev=c&hvdvcmdl=&hvlocint=&hvlocphy=9021716&hvtargid=pla-584871265177&psc=1&linkCode=li2&tag=giftology02-20&linkId=b5e841738bfa7339d9f27aae20c34ef0&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0922273294&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=0922273294" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3KnAXo4",
    //         flavor_text:
    //           "We recommend anyone getting into camping pick one of these up, it's a great way to kill time by the campfire.",
    //         lab_results:
    //           "Lab Results: Picture yourself sitting by a campfire, the sun is setting, and you're between sips of the whiskey you brought along for the trip. What do you do with your hands? Learn to tie knots that's what.\n\nFew things make you feel like more of a woodsman than learning to tie a good know, and this kit makes it extremely easy to learn. In less than a few minutes you'll have picked up a useful skill. Once you're done, consider trying out your new talents by setting up a ~~ID=“100088” text=“hammock”~~.",
    //         product_base_price: 9.25,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "camping",
    //         tags: "practical,creative",
    //         tags_sort: "practical,creative,outdoors",
    //         tags_display: "camping,practical,creative",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://images-na.ssl-images-amazon.com/images/I/81oKVu02SNL.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100077,
    //         score: 0.4831784633213337,
    //         product_name: "Ambipolar Cat Bookend",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Ambipolar-Decorative-Bookend-Vintage-Antique/dp/B07W16VTKQ?crid=1J2SFZOIGO9CG&keywords=bookends&qid=1642365821&sprefix=bookends%2Caps%2C108&sr=8-6&linkCode=li2&tag=giftology02-20&linkId=3021d5e5adad37f8327ca16c418efe65&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07W16VTKQ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07W16VTKQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3Gbi7xT",
    //         flavor_text:
    //           "Come on, even a dog person would admit this is adorable.",
    //         lab_results:
    //           "Lab Results: We have a handful of bookends on the website because we think they make for a great unexpected gift, particularly in an era where everyone is judging the books on your shelves in the background of a Zoom meeting. \n\nIf they like cats and books, this is our recommendation. Otherwise here's one with ~~ID=“100180” text=“chess pieces”~~ and another that uses ~~ID=“100178” text=“the Force”~~.",
    //         product_base_price: 37.9,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "reading,cats",
    //         tags: "cats,books",
    //         tags_sort: "cats,books,indoors",
    //         tags_display: "reading,cats,books",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71cZuNLh8EL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100194,
    //         score: 0.4794622455200842,
    //         product_name: "Glass Tea Kettle with Infuser",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/1000ml-Teapot-Infusers-Removable-Blooming/dp/B09N946CBN?asc_refurl=https%3A%2F%2Fwww.wsj.com%2Fbuyside%2Fgifts%2Fbest-gifts-for-tea-lovers-3250122&linkCode=li3&tag=giftology02-20&linkId=5d381c929d81b5a708d2de468f5ebd06&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09N946CBN&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B09N946CBN" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3qz40Ol",
    //         flavor_text: "For the aesthete tea drinker.",
    //         lab_results:
    //           "Lab Results:  This glass kettle is great for anyone that wants to appreciate the look as well as the taste of delicious tea.",
    //         product_base_price: 22.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "homeChef",
    //         tags: "tea,fun",
    //         tags_sort: "tea,delicious",
    //         tags_display: "tea,delicious",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61PDVmuUDjL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100049,
    //         score: 0.4792037838049538,
    //         product_name: "Nana Hats",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Preserver-Bananas-Fresher-BPA-Free-Silicone/dp/B08Z3QZ664?keywords=nana%2Bhats&qid=1636515282&qsid=145-7991310-5477726&sr=8-2&sres=B08QMY9CR5%2CB085KVLKPL%2CB07SXJ4T2L%2CB08YCYL2J5%2CB07VJYYZ32%2CB093BVZBQV%2CB01MRYUN1W%2CB08SY84NSY%2CB084YRKVLS%2CB07XD74LLG%2CB08BKXH7PF%2CB097D27BJ7%2CB08113SKDM%2CB00O1473C4%2CB07VFF9VNF%2CB0831FVQK1%2CB08L78J5N8%2CB081121FYN%2CB07QGFHLBR%2CB0153W5216&th=1&linkCode=li2&tag=giftology02-20&linkId=b62388c8b0627c445ea71bcf5580c281&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08Z3QZ664&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08Z3QZ664" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3lSwIHP",
    //         flavor_text:
    //           "Chimpanzees that like prefer their favorite snack to also be adorable.",
    //         lab_results:
    //           "Lab Results: These really embody the Just for Fun category of gift giving. If you know your audience, they're guaranteed for a laugh. Great for White Elephant gifts or stocking stuffers, we particularly like how the different designs make this one customizable. They also come with a silicone cap containing a magnet, ensuring that your banana hats always stay secure.",
    //         product_base_price: 12.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef",
    //         tags: "quirky",
    //         tags_sort: "quirky,indoors",
    //         tags_display: "justForFun,quirky",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/810LOAhBxiL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100140,
    //         score: 0.4769295189864984,
    //         product_name: "Garmin Forerunner 55, GPS Running Watch",
    //         category: "Health And Wellness",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Garmin-Forerunner-Running-Suggested-Workouts/dp/B092RCLKHN?th=1&linkCode=li2&tag=giftology02-20&linkId=689c4d11c1f7dfbca8334ec4b0f7eeb1&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B092RCLKHN&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B092RCLKHN" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3M9WRwj",
    //         flavor_text:
    //           "If their New Year's resolution is to run a marathon, this is the perfect piece of tech to give them an edge.",
    //         lab_results:
    //           "Lab Results: Why get a Garmin when most smartwatches have similar features? Because they just don't do them as well. The Forerunner offers up to two weeks of battery life and industry leading GPS tracking. We do enjoy our other smartwatches for many applications, but this is the runner's watch.\n\nWant to get in shape but don't need all the features of the Garmin? We recommend a ~~ID=“100033” text=“Fitbit”~~.",
    //         product_base_price: 199.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "healthAndWellness",
    //         tags: "athletic,running",
    //         tags_sort: "athletic,outdoors",
    //         tags_display: "healthAndWellness,athletic,running",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51YGVXYDFuS._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100154,
    //         score: 0.47213473722960825,
    //         product_name: "Traditional Ferro Rod",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B01C7YACQ8?asc_campaign=commerce-pra&asc_refurl=https%3A%2F%2Fwww.businessinsider.com%2Fguides%2Fbest-fire-starter&asc_source=browser&linkCode=li2&tag=giftology02-20&linkId=91ea854e717981f56f98478c79397a5c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01C7YACQ8&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01C7YACQ8" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3G9GYlw",
    //         flavor_text:
    //           "The serious outdoorsman...or just someone who really likes Alone on the History Channel.",
    //         lab_results:
    //           "Lab Results: We brought one of these on our most recent camping trip and had a blast using it to get our fires going. Don't be fooled, even with a ferro rod a decent amount of prep work needs to go in to finding dry tinder, for first time users we recommend bringing a handful of cotton balls. Still, this is a great gift for serious campers that want to be one step closer to living totally off the grid.",
    //         product_base_price: 16,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "camping",
    //         tags: "practical,handy",
    //         tags_sort: "practical,handy,outdoors",
    //         tags_display: "camping,practical,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51Q7TGnifxL._AC_SL1024_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100239,
    //         score: 0.46699486572362486,
    //         product_name: "Paperless Towels",
    //         category: "Home Chef",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/115126664/paperless-towels-unpaper-towels-washable?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=eco+friendly&ref=sr_gallery-1-26&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Eco-conscious individuals, sustainability champions, and those who seek a greener alternative to disposable paper products.",
    //         lab_results:
    //           "Lab Results: Wipe out waste with these towels. Reusable and eco-friendly, they're your go-to for spills, cleaning, and a kinder planet. Clean up, without waste!",
    //         product_base_price: 18,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "homeChef",
    //         tags: "homeChef,eco-friendly",
    //         tags_sort: "homeChef,eco-friendly",
    //         tags_display: "homeChef,eco-friendly",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/5977310/r/il/fd3553/1426062709/il_fullxfull.1426062709_scp7.jpg",
    //         listing_id: 115126664,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100236,
    //         score: 0.4645609761657447,
    //         product_name: "Greenhouse T-Shirt",
    //         category: "Gardening",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1287866932/garden-shirt-ill-be-in-my-office-shirt?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=gardening+shirt&ref=sr_gallery-1-41&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Plant aficionados, indoor gardeners, and anyone who thrives in the lush tranquility of their leafy workspace.",
    //         lab_results:
    //           "Lab Results: Declare your professional domain with a twist of green in this tee. It's a nod to your leafy sanctuary, where productivity and plants flourish side by side. Commence the indoor jungle workday!",
    //         product_base_price: 28.24,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "gardening,homeOffice",
    //         tags_sort: "gardening,homeOffice",
    //         tags_display: "gardening,homeOffice",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/25448819/r/il/aa2ac3/4148937240/il_fullxfull.4148937240_i7ru.jpg",
    //         listing_id: 1287866932,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 1,
    //         score: 0.45278561916418403,
    //         product_name: "Hydro Flask Water Bottle",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Hydro-Flask-Insulated-Stainless-Pacific/dp/B01MSCXO76?keywords=Hydro+Flask+Water+Bottle+-+Stainless+Steel%2C+Reusable%2C+Vacuum+Insulated-+Wide+Mouth+with+Leak+Proof+Flex+Cap&qid=1637941040&qsid=146-6939056-5844667&sr=8-5&sres=B01MSCXO76%2CB083GBK2HY%2CB083GBTPSY%2CB07YXMJZQW%2CB07YXMFPBM%2CB07MZBR1BL%2CB083GBXKCK%2CB01GW2G92W%2CB083GBQ236%2CB083GBLFN7%2CB01GW2H09S%2CB083GBH38N%2CB01ACARNIO%2CB083G9QV62%2CB07YXLYFZF%2CB07MZ6SD6X%2CB01N34YZD8%2CB08B2BD7S3%2CB08WX17BZN%2CB01ACAXD9C&srpt=BOTTLE&linkCode=li2&tag=giftology02-20&linkId=889e069baef0e217044d70b24021b75c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01MSCXO76&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01MSCXO76" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zqPRDQ",
    //         flavor_text:
    //           "Campers and hikers who want cold, refreshing water, or anyone who needs to sneak wine into a family reunion.",
    //         lab_results:
    //           "Lab Results: Hydro Flask makes a great product with these water bottles. They're trendy, useful, and have a stylish look that makes them feel a little extra special. This is the sort of gift that is great for a Secret Santa event.",
    //         product_base_price: 33.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "camping",
    //         tags: "trendy",
    //         tags_sort: "trendy,outdoors",
    //         tags_display: "camping,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61YFgy49YBL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 46,
    //         score: 0.44872323256307245,
    //         product_name: "Holiday Coffee Mug",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B082DJNKKB?ascsubtag=%5Bartid%7C2164.g.34212065%5Bsrc%7C%5Bch%7C%5Blt%7C&th=1&linkCode=li2&tag=giftology02-20&linkId=e644410687cc255afb14ee6e34d84ecd&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B082DJNKKB&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B082DJNKKB" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3TZNFMM",
    //         flavor_text: "The perfect mug when you're home alone.",
    //         lab_results:
    //           "Lab Results: This is a simple one. If you know they are going to get the reference it makes a great White Elephant gift for a Coworker.\n\nIn the market for a different mug? Look to the~~ID=“100053” text=“stars”~~.",
    //         product_base_price: 16.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef",
    //         tags: "coffee",
    //         tags_sort: "coffee,indoors",
    //         tags_display: "homeChef,coffee",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61dpqQQtS8L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100176,
    //         score: 0.4447083032022325,
    //         product_name: "And Then There Were None",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Agatha-Christie-Mysteries-Collection-Paperback/dp/0062073478?_encoding=UTF8&qid=1658084190&sr=1-1&linkCode=li2&tag=giftology02-20&linkId=03b01eec0365ddadc90a3c8135efa98d&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=0062073478&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=0062073478" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U3kb0H",
    //         flavor_text:
    //           "Fans of the mystery genre owe it to themselves to pick up this classic, which will keep you guessing to the very end.",
    //         lab_results:
    //           "Lab Results: Agatha Christie is the original master of the mystery genre and seems to be having a resurgence as of late. What we love about this book is how seriously she takes the reader, leaving clues just subtle enough that you can follow along at home. For a fan of mystery novels, we think it's required reading.",
    //         product_base_price: 9.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "reading",
    //         tags: "fun,thoughtful,books",
    //         tags_sort: "books,indoors",
    //         tags_display: "reading,gripping,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/P/0062073478.01._SCLZZZZZZZ_SX500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100080,
    //         score: 0.44380012401862173,
    //         product_name: "Decorative Chess Bookends",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/jinhuoba-Supports-Supports-Suitable-6-7x4-1x3-5inch/dp/B07PF8QW8F?crid=1J2SFZOIGO9CG&keywords=bookends&qid=1642365821&sprefix=bookends%2Caps%2C108&sr=8-15&linkCode=li2&tag=giftology02-20&linkId=e7a3b7a7b9cf243a47957a2499c1ea0c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07PF8QW8F&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07PF8QW8F" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42ZGFE0",
    //         flavor_text:
    //           "For the King or Queen that likes to curl up with a good book.",
    //         lab_results:
    //           "Lab Results: We have a handful of bookends on the website because we think they make for a great unexpected gift, particularly in an era where everyone is judging the books on your shelves in the background of a Zoom meeting. \n\nIf they like chess and books, this is our recommendation. Otherwise here's one with ~~ID=“100177” text=“cute cats”~~ and another that uses ~~ID=“100178” text=“the Force”~~.",
    //         product_base_price: 28.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "reading,boardGames",
    //         tags: "books",
    //         tags_sort: "books,indoors",
    //         tags_display: "reading,books",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61pyHT5v8WL._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100053,
    //         score: 0.4403593348643685,
    //         product_name:
    //           "The Unemployed Philosophers Guild Heat Changing Constellation Mug",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Unemployed-Philosophers-Guild-Changing-Constellation/dp/B00B7LUVZK?keywords=constellation%2Bmug&qid=1636516407&qsid=145-7991310-5477726&s=home-garden&sr=1-4&sres=B00B7LUVZK%2CB07GVCP5W2%2CB07BVQKXVF%2CB08LKT4LKR%2CB084B73Q76%2CB08N61W3CW%2CB08DFT69TD%2CB097968BWB%2CB0823S9CNK%2CB07RB1NJRZ%2CB07QZLJ2HW%2CB07F2QCR2K%2CB09793XK6X%2CB089KNLF2T%2CB093TLVQZ9%2CB07R7QQRZN%2CB07R8VM5GP%2CB07DY9QKJC%2CB07WHQQTSZ%2CB07L1BB986&srpt=DRINKING_CUP&th=1&linkCode=li2&tag=giftology02-20&linkId=496353ea34af3e494142d97647b57232&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00B7LUVZK&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00B7LUVZK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zs5Bq5",
    //         flavor_text: "Armchair astronomers.",
    //         lab_results:
    //           "Lab Results: This is another good one for White Elephant. Pour in a hot cup of coffee and watch the constellations develop.\n\nIn the market for a different mug? How about ~~ID=“100060” text=“something more festive”~~.",
    //         product_base_price: 16.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef",
    //         tags: "coffee,science",
    //         tags_sort: "coffee,indoors",
    //         tags_display: "homeChef,coffee,science",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/41yZC8bnStS._AC_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100217,
    //         score: 0.4387856807381676,
    //         product_name: "OnOff Again T-Shirt",
    //         category: "Technology",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1286334574/technology-teacher-shirt-computer?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=technology&ref=sr_gallery-1-17&pro=1&organic_search_click=1",
    //         flavor_text:
    //           "Tech troubleshooters, IT wizards, and anyone fluent in the universal tech fix.",
    //         lab_results:
    //           "Lab Results: Wear your IT expertise with pride. This shirt's a witty tech support declaration, perfect for helping friends and befuddled devices alike. Restart with style!",
    //         product_base_price: 11.9,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "technology",
    //         tags_sort: "technology",
    //         tags_display: "technology,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/28231934/r/il/09930a/4189581665/il_fullxfull.4189581665_n9y8.jpg",
    //         listing_id: 1286334574,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100119,
    //         score: 0.43877909273040844,
    //         product_name: "Dig It Up! Discoveries (Mermaids)",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/MindWare-Dig-Up-Discoveries-Mermaids/dp/B07XF23PLY?crid=14JZFMEF023W4&keywords=mermaid%2Bdig%2Bkit&qid=1669580850&sprefix=mermaid%2Bdig%2Bkit%2Caps%2C92&sr=8-1-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzNTE5VzFKQlVHR05CJmVuY3J5cHRlZElkPUEwNzQxMjEwNTFRTjdXSUpLVTNSJmVuY3J5cHRlZEFkSWQ9QTAyMjYzMjkzMUw0M09YQURIVThCJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ&th=1&linkCode=li2&tag=giftology02-20&linkId=61bf52662408a236b6d0c3ee987e1415&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07XF23PLY&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07XF23PLY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3nDqYlC",
    //         flavor_text:
    //           "Who doesn't want to dig through clay to find treasure?",
    //         lab_results:
    //           "Lab Results: This is a fun and unique way to get your kids to interact with their toys. Each mermaid is encased in a bed of destructible clay, just soak them in water and then let them go at it. They'll be miniature archaeologists in no time. They also offer fairies, dinosaurs, and puppies!",
    //         product_base_price: 29.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 6,
    //         age_max: 12,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81OxJ-3Sc5L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100120,
    //         score: 0.43877909273040844,
    //         product_name: "Space Exploration Shuttle",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Exploration-Aerospace-Building-Transport-Launcher/dp/B0BG1TFJHC?keywords=space+exploration+shuttle&qid=1668886092&sr=8-5&linkCode=li2&tag=giftology02-20&linkId=45480f3640fcaf7820fada960390e25d&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BG1TFJHC&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0BG1TFJHC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42WABfc",
    //         flavor_text: "Little astronauts with big dreams.",
    //         lab_results:
    //           "Lab Results: Good for ages 6 and up, give your kids the opportunity to build their own toys. Great for that age when space becomes inescapably fascinating.",
    //         product_base_price: 25.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 6,
    //         age_max: 12,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71CIlinXCVS._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100121,
    //         score: 0.43618332856932873,
    //         product_name: "LEGO Star Wars Stormtrooper Helmet",
    //         category: "Arts and Crafts",
    //         html_tag:
    //           '<a href="https://www.amazon.com/LEGO-Stormtrooper-Helmet-Building-Collectible/dp/B083JXYK72?crid=3RODIDGWG5XCM&keywords=lego&qid=1644005170&sprefix=lego%2Caps%2C112&sr=8-9&linkCode=li2&tag=giftology02-20&linkId=1ff455653660106038d4b5d3e1847c02&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B083JXYK72&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B083JXYK72" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U303vr",
    //         flavor_text:
    //           "If they were playing with LEGO and Star Wars when they were kids, why wouldn't they now that they're all grown up?",
    //         lab_results:
    //           "Lab Results: With over 600 pieces, this will take a little time to put together, but for fans of LEGO and Star Wars, it's an obvious choice.",
    //         product_base_price: 59.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 6,
    //         age_max: 12,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "artsAndCrafts",
    //         tags: "creative,handy",
    //         tags_sort: "creative,handy",
    //         tags_display: "artsAndCrafts,creative,handy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71R0Vww3ScL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100067,
    //         score: 0.4343019915650407,
    //         product_name: "Nintendo Switch Online Membership",
    //         category: "Gaming",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Nintendo-Switch-12-Month-Individual-Membership/dp/B07FV64QLX?&linkCode=li2&tag=giftology02-20&linkId=3eba831690f9ea41a5206cec45c0e0cf&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07FV64QLX&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07FV64QLX" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3G8XHWj",
    //         flavor_text:
    //           "Switch owners that will love the nostalgia of having access to a library of classic NES and SNES games, but don't sleep on the wildly addictive Tetris 99.",
    //         lab_results:
    //           "Lab Results: This is essentially a gift card, so we find it works best if you already know the recipient is a subscriber. Think of it has buying them a free month (or more) of entertainment.",
    //         product_base_price: 19.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "gaming",
    //         tags: "nerdy",
    //         tags_sort: "nerdy,indoors",
    //         tags_display: "gaming,nerdy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61ru8L994TL._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100085,
    //         score: 0.4342343932164145,
    //         product_name: "Pixel Cow T-Shirt",
    //         category: "Gaming",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/785500350/pixel-cow-love-unisex-t-shirt-farm?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=stardew+valley&ref=sc_gallery-1-3&plkey=4486db211813f55f3fdc5fe2d11440ac986a1c3f%3A785500350",
    //         flavor_text:
    //           "Your wife, who said a game about farming sounded boring and now she's seriously cutting in to your screentime.",
    //         lab_results:
    //           "Lab Results: This is a deep cut, but if their favorite part of Stardew Valley is greeting their cows in the morning, they must have this shirt.",
    //         product_base_price: 19.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "thoughtful",
    //         hobbies_interests: "gaming",
    //         tags: "nerdy",
    //         tags_sort: "nerdy,indoors",
    //         tags_display: "gaming,nerdy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/18869926/r/il/0202ab/2325059517/il_fullxfull.2325059517_svyx.jpg",
    //         listing_id: 785500350,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 8,
    //         score: 0.43041776206098886,
    //         product_name: "DASH Hot Air Popcorn Popper Maker",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B07NWCTXHH?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=8388e5f48877d472dcd1d3c69c12f275&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07NWCTXHH&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07NWCTXHH" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40Rm3f5",
    //         flavor_text:
    //           "Folks who would rather stay home with a pause button than visit the cinema, but still crave that delicious popcorn.",
    //         lab_results:
    //           "Lab Results: We originally touted this gift as a nice blend of fun, function, and affordability that make it a perfect White Elephant gift, but after using it for a few years we really recommend it for any household that could use more mess free popcorn. The key is that the air popping method does not require any oil and surprisingly has a nearly perfect pop rate for your kernels. Spice up movie night with a guilt free snack.",
    //         product_base_price: 23,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef",
    //         tags: "efficient",
    //         tags_sort: "efficient,indoors",
    //         tags_display: "homeChef,efficient",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/31Wb4kZDeGL._AC_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100029,
    //         score: 0.42057159832485913,
    //         product_name: "GoSports Backyard Bocce Set",
    //         category: "Outdoor Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/GoSports-Backyard-Pallino-Measuring-Choose/dp/B00T0GYEGG?dchild=1&keywords=bocce%2Bball&qid=1616974675&sr=8-5&th=1&linkCode=li2&tag=giftology02-20&linkId=0a32b6863d1bee691044b7f1d9b936bb&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00T0GYEGG&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00T0GYEGG" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3ZzqhXC",
    //         flavor_text: "For when the world is your gaming court.",
    //         lab_results:
    //           "Lab Results: Bocce traces its roots back to at least 5,000 BC and eventually gaining popularity in Italy where the Romans spread it around the world. Possibly our favorite outdoor game, Bocce neatly walks the line between a highly competitive and delightfully laid-back game. You can play this game on an official court, but we find it at its best when you simply improvise in your back yard.\n\nIn the right ballpark but looking for something else? How about ~~ID=“100027” text=“Spikeball”~~?",
    //         product_base_price: 39.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "outdoorGames",
    //         tags: "athletic,competitive",
    //         tags_sort: "athletic,competitive,outdoors",
    //         tags_display: "outdoorGames,athletic,competitive",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81if2nTUbEL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100252,
    //         score: 0.4145733205941292,
    //         product_name: "A Great Outdoor Coffee Experience",
    //         category: "Camping",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1010578024/specialty-coffee-camping-gift-innovative?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=sample+packs&ref=sr_gallery-1-8&bes=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Nature lovers, caffeine aficionados, and those who crave a perfectly brewed cup amid serene surroundings.",
    //         lab_results:
    //           "Lab Results: Elevate your outdoor adventure with the perfect cup of coffee. Whether by a campfire or under the open sky, savor coffee amidst nature's embrace. Sip and soak in the wilderness!",
    //         product_base_price: 19.24,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "camping",
    //         tags: "camping",
    //         tags_sort: "camping,practical",
    //         tags_display: "camping,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/24955081/r/il/7cb482/5337493643/il_fullxfull.5337493643_qgvo.jpg",
    //         listing_id: 1010578024,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100230,
    //         score: 0.41381763685146766,
    //         product_name: "The Shire Candle",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1293389308/the-shire-literary-candle-book-lover?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=nerdy&ref=sc_gallery-1-9&pro=1&sts=1&plkey=af700d01c0071260b5817f6ca074e2cac4098f51%3A1293389308",
    //         flavor_text:
    //           "Fantasy fans, Tolkien enthusiasts, and those who long for the cozy, idyllic charm of hobbit life.",
    //         lab_results:
    //           "Lab Results: Transport your senses to Middle-earth with this candle. Embrace the comforting scents of The Shire, where adventure and warmth blend in perfect harmony. Let hobbit dreams flicker to life!",
    //         product_base_price: 9.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "reading,nerdy",
    //         tags_sort: "reading,nerdy",
    //         tags_display: "reading,nerdy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/29388893/r/il/533283/5836727392/il_fullxfull.5836727392_e3m3.jpg",
    //         listing_id: 1293389308,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100225,
    //         score: 0.4133842638016798,
    //         product_name: "Personalized Herb Stripper",
    //         category: "Home Chef",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1322593072/herb-stripper-handmade-from-olive-wood?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=chef&ref=sr_gallery-1-23&pro=1&frs=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Cooking enthusiasts, herb aficionados, and those who relish fresh flavors in a pinch.",
    //         lab_results:
    //           "Lab Results: Elevate your culinary finesse with this herb stripper. Crafted from olive wood, it's both functional and artistic. Unleash flavors effortlessly!",
    //         product_base_price: 10.46,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "homeChef",
    //         tags: "affordable,practical,efficient",
    //         tags_sort: "practical,efficient,indoors",
    //         tags_display: "homeChef,affordable,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/19247692/r/il/a155ff/5658065184/il_fullxfull.5658065184_2tef.jpg",
    //         listing_id: 1322593072,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100027,
    //         score: 0.4103488625342501,
    //         product_name: "Spikeball Standard 3 Ball Kit",
    //         category: "Outdoor Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Spikeball-Ball-Kit-Playing-Drawstring/dp/B002V7A7MQ?crid=UCMQUXTYNYQ2&dchild=1&keywords=spikeball&qid=1631144332&sprefix=spikeball%2Caps%2C195&sr=8-6&th=1&linkCode=li2&tag=giftology02-20&linkId=8899ea6b153a4565598b321870765bf8&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B002V7A7MQ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B002V7A7MQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3UgFRXr",
    //         flavor_text:
    //           "Anybody who loves an active day at the beach, or needs a little extra excitement at a barbecue.",
    //         lab_results:
    //           "Lab Results: Admit it, you've seen cooler people than you play this game at the beach and wanted in. Be those cool people. Surprisingly easy to set up and play, Spikeball is a great way to add a little extra fun to your day out.\n\nIn the right ballpark but looking for something else? How about ~~ID=“100029” text=“Bocce Ball”~~?",
    //         product_base_price: 69.96,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "outdoorGames",
    //         tags: "athletic,competitive",
    //         tags_sort: "athletic,competitive,outdoors",
    //         tags_display: "outdoorGames,athletic,competitive",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61p1QRoGnzL._AC_SL1280_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100162,
    //         score: 0.40907302258140077,
    //         product_name: "Dried Lavender Bundle",
    //         category: "Home Decor",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/997401470/lavender-bunch-dried-lavender-bundle?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=dried+flowers&ref=sc_gallery-1-3&pro=1&plkey=20de41e74be71b7d9f00122587c3778225a46438%3A997401470",
    //         flavor_text:
    //           "For people that love flowers, but hate watching them die, these dried flowers will last forever.",
    //         lab_results:
    //           "Lab Results: Dried flowers seem to be having a moment, and we think that makes sense. The issue with fresh flowers is of course, sooner or later they wilt and die. Dry flowers don't have that issue, and the market has responded with some truly vibrant and beautiful offerings.",
    //         product_base_price: 21.49,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "thoughtful,unexpected",
    //         tags_sort: "homeDecor",
    //         tags_display: "homeDecor,thoughtful,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/17799757/r/il/059ea7/3708132276/il_fullxfull.3708132276_5jj0.jpg",
    //         listing_id: 997401470,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100242,
    //         score: 0.40877282081581157,
    //         product_name: "Bike Bracelet",
    //         category: "Just For Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1374062368/minimalist-bicycle-bracelet-platinum?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=biking&ref=sr_gallery-1-28&bes=1&organic_search_click=1",
    //         flavor_text:
    //           "Cyclists, adventure seekers, and those who want to carry their biking passion on their wrist.",
    //         lab_results:
    //           "Lab Results: Pedal your style with this bracelet. A mini bike trinket that celebrates the freedom and joy of cycling. Wear your wheels with pride!",
    //         product_base_price: 7,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "athletic,competitive,trendy",
    //         tags_sort: "athletic,competitive,trendy",
    //         tags_display: "athletic,competitive,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/17844292/r/il/57c76d/4498010478/il_fullxfull.4498010478_4mnb.jpg",
    //         listing_id: 1374062368,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100184,
    //         score: 0.4079287745234395,
    //         product_name: "Succulent",
    //         category: "Home Decor",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Costa-Farms-Echeveria-Succulent-Gold-Charcoal/dp/B075F9RTLP?ac_md=4-1-UG90dGVkIHBsYW50-ac_d_hl_hl_rf&content-id=amzn1.sym.3663916c-38f6-4d73-9801-2e9551111db6%3Aamzn1.sym.3663916c-38f6-4d73-9801-2e9551111db6&crid=11S5NJR0JXP6S&cv_ct_cx=Succulent&keywords=Succulent&pd_rd_i=B075F9RTLP&pd_rd_r=89451eeb-c33e-4114-b4fe-1f148adec297&pd_rd_w=uefO4&pd_rd_wg=0ct2P&pf_rd_p=3663916c-38f6-4d73-9801-2e9551111db6&pf_rd_r=SB6116Q0N6W2CTTYJEQT&qid=1664495879&qu=eyJxc2MiOiI3LjYxIiwicXNhIjoiNy42MiIsInFzcCI6IjcuMzAifQ%3D%3D&sprefix=succulent%2Caps%2C91&sr=1-2-25fd44b4-555a-4528-b40c-891e95133f20&th=1&linkCode=li2&tag=giftology02-20&linkId=12524dd45f7bf4cfc5864a8fcd8c8ee3&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B075F9RTLP&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B075F9RTLP" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3G52aJK",
    //         flavor_text:
    //           "Someone looking to spruce up their desk with some easy to care for greenery.",
    //         lab_results:
    //           "Lab Results: These are awesome little desk plants and unlike some other plants, very low maintenance. About a half a cup of water every two weeks should do it. The little 6-inch ceramic planter is surprisingly eye catching as well. \n\nCan't even be trusted with one of these? Go full ~~ID=“100185” text=“faux”~~.",
    //         product_base_price: 23.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "thoughtful,unexpected",
    //         tags_sort: "homeDecor",
    //         tags_display: "homeDecor,thoughtful,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71e7+-PIEgL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100220,
    //         score: 0.4075372128754488,
    //         product_name: "Sourdough Starter",
    //         category: "Home Chef",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/783541010/150-year-old-san-francisco-sourdough?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=arts+and+crafts&ref=sr_gallery-1-27&bes=1&organic_search_click=1",
    //         flavor_text:
    //           "Bread enthusiasts, aspiring bakers, and those craving the tangy joy of homemade sourdough.",
    //         lab_results:
    //           "Lab Results: Embark on a sourdough adventure with this kit. It's a living culture that brings flour, water, and magic to your kitchen. Cultivate deliciousness!",
    //         product_base_price: 9.46,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "homeChef",
    //         tags: "fun",
    //         tags_sort: "delicious",
    //         tags_display: "homeChef,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/22942239/r/il/7d2e5b/2324266365/il_fullxfull.2324266365_fzqr.jpg",
    //         listing_id: 783541010,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100050,
    //         score: 0.4025632317248635,
    //         product_name: "From Crook to Cook",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Crook-Cook-Platinum-Recipes-Kitchen/dp/1452179611?crid=UBDIXXTBZ59D&keywords=snoop+dogg+cookbook&qid=1636515351&qsid=145-7991310-5477726&sprefix=snoop+%2Caps%2C225&sr=8-2&sres=1452179611%2C1954220006%2CB08JZWNGJQ%2C9185639702%2C1786270897%2C1368071066%2C1984826859%2CB08NDVHYVB%2C1507214510%2C161765860X%2C1335522522%2C1641523107%2C1638788014%2C1612438725%2C1683838440%2C1641521198&srpt=ABIS_BOOK&linkCode=li2&tag=giftology02-20&linkId=936d6ca64c5830b9595a5764f2aa9203&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1452179611&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=1452179611" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zqRx06",
    //         flavor_text:
    //           "Are you curious what to pair with your gin and juice? Snoop provides a series of surprisingly down to earth and accessible recipes.",
    //         lab_results:
    //           "Lab Results: A good White Elephant gift for someone that is a fan of both cooking and music. As you may expect, this gift is not a deep dive into the culinary arts as much as it is a love letter to homestyle cooking, Oddly that means you end up with a surprisingly accessible take on classics takes on ribs, mac & cheese, quesadillas, and all sorts of cookies. There are also plenty of little dips into Snoops personal style, including what he keeps in his pantry.",
    //         product_base_price: 12.74,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef",
    //         tags: "entertaining,books",
    //         tags_sort: "books,indoors",
    //         tags_display: "justForFun,entertaining,books",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://images-na.ssl-images-amazon.com/images/I/81S+-1xB4WL.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100177,
    //         score: 0.4009888382375944,
    //         product_name: "Project Hail Mary: A Novel",
    //         category: "Reading",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Project-Hail-Mary-Andy-Weir-ebook/dp/B08FHBV4ZX?crid=33LWSW4EIAGT7&keywords=project+hail+mary&qid=1658084340&s=books&sprefix=project+h%2Cstripbooks%2C168&sr=1-1&linkCode=li2&tag=giftology02-20&linkId=80be995c752d35cff95ce7ad298b227c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08FHBV4ZX&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08FHBV4ZX" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3K1Ymdh",
    //         flavor_text:
    //           "If you loved The Martian, Weir's latest novel is a delight.",
    //         lab_results:
    //           "Lab Results: Hands down the most fun book I've read this year. Without spoiling it, Andy Weir has introduced one of the most lovable and memorable characters in sci-fi, all while making the reader feel like they are just on the edge of solving the next big mystery. If you loved The Martian, you'll love this.",
    //         product_base_price: 11.11,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "reading",
    //         tags: "fun,thoughtful,books",
    //         tags_sort: "books,indoors",
    //         tags_display: "reading,gripping,thoughtful",
    //         product_card_banner: "New",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/P/B08FHBV4ZX.01._SCLZZZZZZZ_SX500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100058,
    //         score: 0.3991894586602037,
    //         product_name: "Chemex Coffeemaker",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Chemex-Classic-Pour-over-Glass-Coffeemaker/dp/B0000YWF5E?crid=3O3E5G50ZFUM6&keywords=chemex&qid=1665877397&qu=eyJxc2MiOiI0Ljc0IiwicXNhIjoiMy45NSIsInFzcCI6IjMuNjUifQ%3D%3D&sprefix=chemex%2Caps%2C103&sr=8-5&linkCode=li2&tag=giftology02-20&linkId=d69ce4ff2be0225c44afe3b4a7f6d8fe&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0000YWF5E&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0000YWF5E" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42POE6i",
    //         flavor_text: "Environmentally conscious coffee connoisseurs.",
    //         lab_results:
    //           "Lab Results: The Chemex dates to 1941 and is the rare item that blends functionality with beauty seamlessly. If you prefer the subtle flavors provided by the pour over method, this is definitely the place to start.\n\nThis item pairs very well with the ~~ID=“100171” text=“Bean Box Sampler Kit”~~. Prefer the bolder flavors of espresso? We recommend the ~~ID=“100015” text=“Nespresso Essenza Mini”~~.",
    //         product_base_price: 44.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials",
    //         hobbies_interests: "homeChef",
    //         tags: "coffee",
    //         tags_sort: "coffee,indoors,delicious",
    //         tags_display: "homeChef,coffee",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/41Pka0+BDmL._AC_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 207,
    //         score: 0.39339312746612026,
    //         product_name: "Pollinator Seed Mix",
    //         category: "Gardening",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Bentley-Seeds-Pollinator-Seed-Mix/dp/B096WHG6PX?&linkCode=li3&tag=giftology02-20&linkId=777666e6fadc3a853e5cf9a25b6f9480&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B096WHG6PX&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B096WHG6PX" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/45yhQiF",
    //         flavor_text:
    //           "Nature advocates, gardeners, and anyone eager to support the vital work of pollinators.",
    //         lab_results:
    //           "Lab Results: Sow the seeds of biodiversity with this mix. It's a buffet for pollinators, turning your space into a haven for butterflies, bees, and more. Plant for the planet!",
    //         product_base_price: 29.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "gardening,eco-friendly",
    //         tags_sort: "gardening,eco-friendly",
    //         tags_display: "gardening,eco-friendly",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81NYdPErr9L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100090,
    //         score: 0.3922751757856809,
    //         product_name: "Personalized Linen Apron",
    //         category: "Home Chef",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1040558182/personalized-linen-kitchen-apron-custom?click_key=41fcf45271978574e98c0e140dc3d60a530e7e58%3A1040558182&click_sum=ca20a829&ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=cooking&ref=sr_gallery-1-3&organic_search_click=1&pro=1&sts=1",
    //         flavor_text:
    //           "For that person who always has just a couple of drops of sauce on their clothing after making you a home cooked meal.",
    //         lab_results:
    //           "Lab Results: Make your kitchen feel like home with this personalized apron. Made from natural fibers, the fabric feels thick and durable and the apron has a convenient pocket for kitchen tools or a towel.   ",
    //         product_base_price: 23.25,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "thoughtful",
    //         hobbies_interests: "homeChef",
    //         tags: "thoughtful",
    //         tags_sort: "customizable,indoors",
    //         tags_display: "homeChef,thoughtful",
    //         product_card_banner: "Customizable",
    //         direct_image_src:
    //           "https://i.etsystatic.com/17860591/r/il/8a768c/5176637331/il_fullxfull.5176637331_5lvi.jpg",
    //         listing_id: 1040558182,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100131,
    //         score: 0.383847742881286,
    //         product_name: "Any City Map",
    //         category: "Travel",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/765957464/any-city-map-custom-map-print?utm_source=affiliate_window&utm_medium=affiliate&utm_campaign=ca_location_buyer&utm_content=215443&awc=6939_1644008005_7c1a9add21b67c19407698e04526b092",
    //         flavor_text: "Give them a little hometown pride.",
    //         lab_results:
    //           "Lab Results: There's something about your hometown that sparks nostalgia, but skyline silhouettes are a little played out. As an alternative, these custom maps are great and help evoke a sense of the pulse in a city.",
    //         product_base_price: 17.97,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,thoughtful",
    //         hobbies_interests: "",
    //         tags: "thoughtful,travel",
    //         tags_sort: "thoughtful,travel,customizable",
    //         tags_display: "travel,thoughtful",
    //         product_card_banner: "Customizable",
    //         direct_image_src:
    //           "https://i.etsystatic.com/21608114/r/il/734bb3/2194700760/il_fullxfull.2194700760_l2j8.jpg",
    //         listing_id: 765957464,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100226,
    //         score: 0.37829790243085326,
    //         product_name: "Damascus Filet Knife",
    //         category: "Camping",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1398479066/damascus-steel-handmade-fillet-knife?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=chef&ref=sc_gallery-1-6&pro=1&frs=1&plkey=6d6ceab5cb59ff2af99acf740eb4f717bc8197c8%3A1398479066",
    //         flavor_text:
    //           "Culinary adventurers, seafood savants, and those who demand precision in their cuts.",
    //         lab_results:
    //           "Lab Results: Master the art of filleting with this Damascus knife. Crafted for precision, it's a fusion of function and craftsmanship. Slice with finesse!",
    //         product_base_price: 139.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "camping",
    //         tags: "camping",
    //         tags_sort: "camping,practical",
    //         tags_display: "camping,fishing,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/39449886/r/il/9680dd/4711893029/il_fullxfull.4711893029_hhyd.jpg",
    //         listing_id: 1398479066,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100159,
    //         score: 0.370751052254145,
    //         product_name: "Mud Pie Initial Canvas Tote Bag",
    //         category: "Travel",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Mud-Pie-501107-G-Initial-Canvas/dp/B00380YYA6?keywords=mud%2Bpie%2Binitial%2Bcanvas%2Btote%2Bbag&qid=1652056529&sprefix=mud%2Bpie%2Binitial%2B%2Caps%2C96&sr=8-5&th=1&linkCode=li2&tag=giftology02-20&linkId=dcf4fcb84aaf9bd42b77d0e91cc921e8&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00380YYA6&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00380YYA6" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3ZvdCFb",
    //         flavor_text:
    //           "Who doesn't need a durable, trendy tote? Great for birthdays, bridals parties, and beach lovers.",
    //         lab_results:
    //           "Lab Results: Cute, customizable, and durable this is a great way to get a simple gift for a group of the girls.",
    //         product_base_price: 22,
    //         gender: "female",
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "practical,trendy",
    //         tags_sort: "practical,trendy,customizable",
    //         tags_display: "travel,practical,trendy",
    //         product_card_banner: "Customizable",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/91wnCtTppWL._AC_UX679_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100178,
    //         score: 0.36996352699748764,
    //         product_name: "Noshinku Pocket Hand Sanitizer",
    //         category: "Bath and Body",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Noshinku-Refillable-Sanitizing-Moisturizing-Registered/dp/B09QT888MC?crid=34QTVNPLMLOA0&keywords=noshinku+pocket+hand+sanitizer&qid=1664737300&qu=eyJxc2MiOiI0LjE5IiwicXNhIjoiMy42NiIsInFzcCI6IjMuNTkifQ%3D%3D&sbo=RZvfv%2F%2FHxDF%2BO5021pAnSA%3D%3D&sprefix=noshinku%2Caps%2C104&sr=8-5&linkCode=li2&tag=giftology02-20&linkId=0d77daf246392cec3801c6de18610903&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09QT888MC&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09QT888MC" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40yc92l",
    //         flavor_text:
    //           "Anyone looking to combine the trend of mobile cleanliness with chic design.",
    //         lab_results:
    //           "Lab Results: Let's face it, staying clean is all the rage right now and these little pocket hand sanitizers are sleek enough to make a statement. Combine with a handful of other gifts to make a little gift basket.\n\nPairs very nicely with these ~~ID=“100164” text=“fairy tale bath salts”~~.",
    //         product_base_price: 34,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "eco-friendly,bathAndBody",
    //         tags_sort: "eco-friendly,bathAndBody",
    //         tags_display: "bathAndBody,eco-friendly",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51HcDV7OR0L._SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100229,
    //         score: 0.3690310731171335,
    //         product_name: "Roll to Attackitty",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1439496558/clickity-clackity-shirt-game-dice?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=nerdy&ref=sr_gallery-1-7&pro=1&organic_search_click=1",
    //         flavor_text:
    //           "Tabletop gamers, cat lovers, and those who believe cats have a strategic dice-rolling side.",
    //         lab_results:
    //           "Lab Results: Merge feline charm with gaming prowess in this tee. Cats and dice unite, creating a purrfectly unpredictable adventure. Play with whiskered strategy!",
    //         product_base_price: 17.9,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "cats,nerdy",
    //         tags_sort: "cats,nerdy",
    //         tags_display: "cats,nerdy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/38850397/r/il/2ff36e/4833455657/il_fullxfull.4833455657_20jl.jpg",
    //         listing_id: 1439496558,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100245,
    //         score: 0.36851878861069254,
    //         product_name: "Runner State T-Shirt",
    //         category: "Just For Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/936485492/your-state-runner-tee-shirt-graphic?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=running&ref=sr_gallery-1-5&frs=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Runners with local pride, race enthusiasts, and those who run their state's roads with determination.",
    //         lab_results:
    //           "Lab Results: Combine your love for running and state allegiance with this tee. It's a personal record of your pavement-pounding prowess in your beloved state. Run local, run strong!",
    //         product_base_price: 24,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "athletic,competitive,trendy",
    //         tags_sort: "athletic,competitive,trendy",
    //         tags_display: "athletic,competitive,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/19198813/r/il/e60f39/2872225567/il_fullxfull.2872225567_br3s.jpg",
    //         listing_id: 936485492,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100243,
    //         score: 0.36851878861069254,
    //         product_name: "Cycling State T-Shirt",
    //         category: "Just For Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1350138475/your-state-cycling-tee-shirt-graphic?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=biking&ref=sr_gallery-1-20&frs=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Biking enthusiasts, state pride holders, and those who combine their love for cycling with their love for their home state.",
    //         lab_results:
    //           "Lab Results: Blend cycling passion and state pride with this tee. Pedal through your territory with style, showcasing your dual devotion. Ride local, ride proud!",
    //         product_base_price: 24,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "athletic,competitive,trendy",
    //         tags_sort: "athletic,competitive,trendy",
    //         tags_display: "athletic,competitive,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/19198813/r/il/dc82fd/4408260037/il_fullxfull.4408260037_i5l3.jpg",
    //         listing_id: 1350138475,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100198,
    //         score: 0.36736143394427595,
    //         product_name: "The Mind",
    //         category: "Board Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Pandasaurus-Games-201809PAN-Mind-Card/dp/B07C4F3KLF?crid=2XI3DV8OFJ66Q&keywords=the%2Bmind%2Bcard%2Bgame&qid=1692225933&sprefix=the%2Bmind%2Caps%2C119&sr=8-2&th=1&linkCode=li3&tag=giftology02-20&linkId=c68d5753334a855f98f79a1ef4b45370&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07C4F3KLF&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B07C4F3KLF" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/47tVBMR",
    //         flavor_text: "Anyone except literal telepaths.",
    //         lab_results:
    //           "Lab Results:  It's so simple. Just count to 100 with your friends, no big deal. It's also the most addictive game we've played this year, give it a try!",
    //         product_base_price: 14.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 8,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "boardGames",
    //         tags: "board games",
    //         tags_sort: "board games",
    //         tags_display: "board games, portable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/41TzgCI0nEL._AC_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100047,
    //         score: 0.36229462127905376,
    //         product_name: "Mini-pancake Maker",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/DMS001AQ-Electric-Individual-Breakfast-Indicator/dp/B0169N1YMO?crid=35TS9EX95FO7C&keywords=mini%2Bpancakes%2Bmaker&qid=1636514961&qsid=145-7991310-5477726&sprefix=mini%2Bpancka%2Caps%2C226&sr=8-4&sres=B081W936XD%2CB0169N1YMO%2CB08SKL2V8W%2CB08FBHN5H7%2CB00HEXQGFE%2CB07H4ZJ4K9%2CB08HLYD57N%2CB07L4XW3QG%2CB093KV94L5%2CB09B9VK256%2CB091BBW9DK%2CB07CG3T1H6%2CB08JYHM26R%2CB0922TWSHK%2CB096KGW39G%2CB09GK2Z259&srpt=COUNTERTOP_GRIDDLE_APPLIANCE&th=1&linkCode=li2&tag=giftology02-20&linkId=83eda53620b1e524232ba991403720bc&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0169N1YMO&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0169N1YMO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3K0T6GM",
    //         flavor_text:
    //           "This product, as well as the similar Mini-Waffle Maker, make a great addition for anyone with kids at home or a late night-sweet tooth.",
    //         lab_results:
    //           "Lab Results: This is a fun one. The price point also makes them perfect as a gag gift for the office party. That said, this little device is surprisingly useful, and your recipient may find themselves using it more frequently than they first expect.",
    //         product_base_price: 12.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef",
    //         tags: "whiteElephant",
    //         tags_sort: "indoors",
    //         tags_display: "homeChef,whiteElephant",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61zx5d4n1nL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100206,
    //         score: 0.36207124812224545,
    //         product_name: "Yoda Coffee Shirt",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1274947888/baby-yoda-shirt-coffee-baby-yoda-coffee?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=coffee&ref=sr_gallery-1-15&pro=1&organic_search_click=1",
    //         flavor_text:
    //           "Sci-fi fans, coffee addicts, and those who find the adorable Baby Yoda as irresistible as their morning caffeine fix.",
    //         lab_results:
    //           "Lab Results: Merge the cuteness of Baby Yoda with the iconic allure of Starbucks in this tee. It's a collision of galaxies that brings together two universal loves: intergalactic adventures and perfectly brewed beverages. Slip into this shirt and embrace the Force of fashion while showing off your allegiance to both the Star Wars universe and your favorite coffee haunt. It's a mashup that's out of this world!",
    //         product_base_price: 25.5,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "coffee,nerdy",
    //         tags_sort: "coffee,nerdy",
    //         tags_display: "coffee,nerdy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/36940332/r/il/863e20/5790872263/il_fullxfull.5790872263_7xzl.jpg",
    //         listing_id: 1274947888,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100155,
    //         score: 0.36127735410131284,
    //         product_name: "Personalized Camp Mug",
    //         category: "Camping",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/825762710/camp-mug-personalized-camping-mountain?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=camping&ref=sr_gallery-1-8&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "If you've ever cherished that morning cup of campfire coffee with someone special, this is a great way to remind them of all the fond memories.",
    //         lab_results:
    //           "Lab Results: For most of us, the first thing we do in the morning on a camping trip is fill up a cup of hot instant coffee. They’ll smile every time they do that in one of these personalized mugs.",
    //         product_base_price: 17.6,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "camping",
    //         tags: "practical,thoughtful",
    //         tags_sort: "practical,thoughtful,customizable,outdoors,tea,coffee",
    //         tags_display: "camping,practical,thoughtful",
    //         product_card_banner: "Customizable",
    //         direct_image_src:
    //           "https://i.etsystatic.com/23605731/r/il/e142be/5820125343/il_fullxfull.5820125343_demv.jpg",
    //         listing_id: 825762710,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100244,
    //         score: 0.36029972565504126,
    //         product_name: "Runday Shirt",
    //         category: "Just For Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1022697823/runday-shirt-running-shirt-runner-gifts?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=running&ref=sr_gallery-1-24&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Runners, fitness fanatics, and those who believe that every day is a perfect day for a run.",
    //         lab_results:
    //           'Lab Results: Celebrate the joy of running with this shirt. It\'s a wearable declaration that every day is "Runday." Lace up and conquer the road!',
    //         product_base_price: 29.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "athletic,competitive,trendy",
    //         tags_sort: "athletic,competitive,trendy",
    //         tags_display: "athletic,competitive,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/25836833/r/il/79d636/3095070444/il_fullxfull.3095070444_6of3.jpg",
    //         listing_id: 1022697823,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100168,
    //         score: 0.3586544813726822,
    //         product_name: "Bath Bomb Frappe",
    //         category: "Bath and Body",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/847113987/bath-bombunicorn-bath-bombfrappe-bath?click_key=800e471b6b1e392d3ea3148249bbfcae81712d77%3A847113987&click_sum=93842363&ref=internal_similar_listing_bot-5&frs=1",
    //         flavor_text: "Makes a great gift for Bridesmaids.",
    //         lab_results:
    //           "Lab Results: These bath bombs are all flair. These lavender scented frappes are too adorable not to include in a bridesmaid box.\n\nPairs very nicely with these ~~ID=“100164” text=“fairy tale bath salts”~~.",
    //         product_base_price: 8,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "relaxing,unexpected,bathAndBody",
    //         tags_sort: "bathAndBody,indoors,coffee",
    //         tags_display: "bathAndBody,relaxing,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/23774047/r/il/838128/2488703103/il_fullxfull.2488703103_6ic9.jpg",
    //         listing_id: 847113987,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 6,
    //         score: 0.3583528206149968,
    //         product_name: "Wood Smoked Grill Kit",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Cooking-Gift-Set-Smoker-Birthday/dp/B01DVJ66H2?dchild=1&keywords=barbecue+smoker+kit&qid=1625525079&sr=8-9&linkCode=li2&tag=giftology02-20&linkId=51820bf8a0b90d18fa60416946c9cd56&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01DVJ66H2&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01DVJ66H2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3ZAx0ki",
    //         flavor_text:
    //           "Folks who want to experiment with smoking but have large smoker commitment issues.",
    //         lab_results:
    //           "Lab Results: Let's face it, signing up for a real smoker is a major commitment, with popular models approaching $1,000. This kit allows your recipient to dip their toe in the water of all that the world of smoking has to offer. The center piece of this kit is a stainless-steel smoking tray. After loading it up with one of three types of wood chips, you just set it inside your existing grill and weight for it to impart flavor. The kit has a few other fun accessories, including smoked salt and recipe cards. Overall, the presentation is excellent, and really helps elevate the gift as a whole.",
    //         product_base_price: 49.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "homeChef",
    //         tags: "fun",
    //         tags_sort: "delicious",
    //         tags_display: "homeChef,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81Q8SoOZdsS._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 11,
    //         score: 0.35651497844064445,
    //         product_name: "Victorinox Fibrox Pro Chef's Knife",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Victorinox-Fibrox-Chefs-Knife-8-Inch/dp/B000638D32?dchild=1&keywords=victorinox+fibrox+pro+chef%27s+knife&qid=1625505383&s=industrial&sr=1-5&linkCode=li2&tag=giftology02-20&linkId=f6b67cfe2c9d04d5c2e36c666e6eab33&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000638D32&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B000638D32" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3K57uhm",
    //         flavor_text:
    //           "Anyone who loves to cook, but isn't quite ready for a more robust Chef's Knife.",
    //         lab_results:
    //           "Lab Results: We're big fans of a classic, robust chef's knife, a true game changer in the kitchen. If the best they are using is an off brand knife you stole from your parents, or the box set of knives you bought in college, this will feel like a major upgrade. You may recognize Victorinox as the same folks who make Swiss Army Knives, and the 8'' Victorinox Fibrox is a great all, purpose knife they can handle just about any task in the kitchen.\n\nLike the idea but looking for an upgrade? Check out the ~~ID=“100016” text=“Wüsthof Classic Ikon”~~ as our premium pick in this category.",
    //         product_base_price: 54,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "homeChef",
    //         tags: "affordable,practical,efficient",
    //         tags_sort: "practical,efficient,indoors",
    //         tags_display: "homeChef,affordable,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71pceby1tuL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100253,
    //         score: 0.35435445884222416,
    //         product_name: "Whipped Body Butter Samples",
    //         category: "Bath and Body",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1223933802/true-samples-whipped-body-butter-non?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=sample+packs&ref=sr_gallery-1-19&bes=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Skincare enthusiasts, self-care devotees, and those seeking silky, luxurious skin.",
    //         lab_results:
    //           "Lab Results: Indulge in skin pampering with these buttery samples. Try a collection of velvety delights, treating your skin to rich nourishment. Embrace the luxury of self-care!",
    //         product_base_price: 3,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "bathAndBody,indoors,coffee",
    //         tags_sort: "bathAndBody,indoors",
    //         tags_display: "bathAndBody,relaxing,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/20533383/r/il/ca7e31/4521351708/il_fullxfull.4521351708_1lln.jpg",
    //         listing_id: 1223933802,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 193,
    //         score: 0.35435445884222416,
    //         product_name: "Aromatherapy Shower Steamers",
    //         category: "Bath and Body",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Aromatherapy-Steamers-Self-Care-9-Stress-Essential/dp/B08BVVFCWN?crid=CSMMFACZ6EZ8&keywords=shower+steamer+cubes&qid=1692464126&refinements=p_72%3A1248873011&rnid=1248871011&s=beauty&sprefix=shower+steamer+cubes%2Caps%2C127&sr=1-6&linkCode=li3&tag=giftology02-20&linkId=ac5e416cb4ae50de381e0c5e2466f3f1&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08BVVFCWN&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B08BVVFCWN" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3P467mP",
    //         flavor_text:
    //           "Shower daydreamers, aromatherapy enthusiasts, and anyone seeking a spa-like escape.",
    //         lab_results:
    //           "Lab Results: Transform your shower into a fragrant retreat with these cubes. Drop in and let the aromatic magic transport you. Indulge your senses!",
    //         product_base_price: 10.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "bathAndBody,indoors,coffee",
    //         tags_sort: "bathAndBody,indoors",
    //         tags_display: "bathAndBody,relaxing,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81xVlZ8PK-L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100132,
    //         score: 0.3531078254564271,
    //         product_name: "Modern Custom Quote",
    //         category: "Home Decor",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/922982310/modern-custom-quote-custom-quote-print?click_key=816983c3da8dad742303cec857888a4bb59743b3%3A922982310&click_sum=193be05d&ref=shop_home_feat_2&pro=1&frs=1",
    //         flavor_text:
    //           "Show them how well you really know them with their favorite quote.",
    //         lab_results:
    //           "Lab Results: This one is tricky; we’re really asking you to do most of the work here. Do they have a favorite quote? What about a line from a famous book or movie? If you can nail the line, it’s a great gift.",
    //         product_base_price: 19.97,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "thoughtful,homeDecor",
    //         tags_sort: "thoughtful,homeDecor,customizable",
    //         tags_display: "homeDecor,thoughtful",
    //         product_card_banner: "Customizable",
    //         direct_image_src:
    //           "https://i.etsystatic.com/21608114/r/il/42005d/2283126146/il_fullxfull.2283126146_5w1d.jpg",
    //         listing_id: 922982310,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100163,
    //         score: 0.3506837528853841,
    //         product_name: "Tirtyl Hand Soap Kit",
    //         category: "Bath and Body",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Tirtyl-Smart-Soap-Single-Kit/dp/B0983SSC4Y?crid=328GBL68FVTE2&keywords=tirtyl%2Bsmart%2Bsoap%2Bkit&qid=1653171772&s=beauty&sprefix=tirty%2Cbeauty%2C66&sr=1-4&th=1&linkCode=li2&tag=giftology02-20&linkId=e973b989bdada96bfbfce49b97abf96e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0983SSC4Y&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0983SSC4Y" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40OGyJq",
    //         flavor_text:
    //           "The eco-conscious consumer looking to make their lives a little greener, and a little more fun as well.",
    //         lab_results:
    //           "Lab Results: Considering we're pitching you on soap, this is a surprisingly fun little gift. The Tirtyl hand soap kit provides a standard refillable pump and 4 tablets that can be used to make your own foamy soap. The tablets are surprisingly fun to use, effervescing in the water until the solution is saturated, and as you might expect smell pretty great. The whole package is designed to cut back on plastic waste.",
    //         product_base_price: 29.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "eco-friendly,bathAndBody",
    //         tags_sort: "eco-friendly,bathAndBody,indoors,practical",
    //         tags_display: "bathAndBody,eco-friendly,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/817FvDm1zvL._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100015,
    //         score: 0.3495814356073123,
    //         product_name: "Nespresso Essenza Mini Espresso Machine",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Nespresso-Essenza-Original-Espresso-Breville/dp/B073ZHT2FM?crid=2RIMDTXACX4B0&dchild=1&keywords=nespresso%2Bessenza%2Bmini&qid=1613014542&sprefix=nespresso%2Be%2Caps%2C179&sr=8-3&th=1&linkCode=li2&tag=giftology02-20&linkId=e039c8421a1e2a8fd4797da2547d23ef&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B073ZHT2FM&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B073ZHT2FM" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3nDorYE",
    //         flavor_text:
    //           "Coffee connoisseurs who like their espresso just so… and strong!",
    //         lab_results:
    //           "Lab Results: Simple and easy to use, this is our favorite pod espresso maker due to its speed and relatively small size. Just be aware that although it can pour a longo, it isn't designed for a full sized cup of coffee. This device is designed for espresso through and through, and we think its countertop space saving low profile is a plus.",
    //         product_base_price: 219.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "homeChef",
    //         tags: "coffee",
    //         tags_sort: "coffee,indoors",
    //         tags_display: "homeChef,coffee",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/812i1ZZaRYL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100182,
    //         score: 0.34935216249588563,
    //         product_name: "Mini Japanese Wooden Puzzle",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/802052741/mini-japanese-ball-puzzle-mechanical?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=mini+puzzle&ref=sc_gallery-1-7&frs=1&plkey=03795b1ef0de920b3b8a622d8c5ad2c8059714cc%3A802052741",
    //         flavor_text: "People that think with their hands.",
    //         lab_results:
    //           "Lab Results: This is a great fidget toy when you need to destress between assignments, and surprisingly beautiful for what amounts to a desk tchotchke.",
    //         product_base_price: 16,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "artsy,creative,thoughtful",
    //         tags_sort: "artsy,creative",
    //         tags_display: "justForFun,creative,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/7760609/r/il/08bf12/2334523991/il_fullxfull.2334523991_qa12.jpg",
    //         listing_id: 802052741,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100183,
    //         score: 0.34935216249588563,
    //         product_name: "Mini Jigsaw Puzzle",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/LAVOZZA-Jigsaw-Puzzles-Challenging-Sunflower/dp/B09W67HY73?crid=2J6940FXZC2M4&keywords=micropuzzle&qid=1664740991&qu=eyJxc2MiOiIzLjk5IiwicXNhIjoiMy43NyIsInFzcCI6IjIuMTMifQ%3D%3D&sprefix=micropuzzl%2Caps%2C119&sr=8-3&linkCode=li2&tag=giftology02-20&linkId=52d5b88ec9056bbe7b72e3455121570a&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09W67HY73&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09W67HY73" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3lUYeV4",
    //         flavor_text:
    //           "Longshot, but ideally for someone who is three inches tall.",
    //         lab_results:
    //           "Lab Results: These little puzzles are a delight. Either for the puzzle enthusiast or just as a desk toy, the shear novelty of this one is sure to put a smile on the recipient's face. If this is an office gift, consider getting one for everyone on the team.",
    //         product_base_price: 16.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "artsy,creative,thoughtful",
    //         tags_sort: "artsy,creative",
    //         tags_display: "justForFun,creative,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/719tTeoaQxL._AC_SL1106_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100158,
    //         score: 0.3439387710813089,
    //         product_name: "Custom Metal Photo Prints",
    //         category: "Home Decor",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Custom-Metal-Photo-Prints-Your/dp/B09B2F4SPJ?keywords=custom%2Bmetal%2Bprints%2Bwith%2Byour%2Bphotos&qid=1652056490&sprefix=custom%2Bmetal%2Bprints%2Bwith%2Caps%2C96&sr=8-11&th=1&linkCode=li2&tag=giftology02-20&linkId=5c2d3a4b58d991dca748e60d4b6fc0b5&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09B2F4SPJ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09B2F4SPJ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40wwTr3",
    //         flavor_text:
    //           "Anyone with a photo of that one perfect memory will love the way the colors pop on these metal prints.",
    //         lab_results:
    //           "Lab Results: If you’ve never had a metal print before, you’ll be amazed by the way colors pop. A customized photo is always a great option when you’re looking for something thoughtful. The idea here is to select a photo that will evoke a strong memory and has plenty of color to play with. Have a picture from the last time you caught a sunset? This is its moment.",
    //         product_base_price: 20.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "artsy,creative,thoughtful",
    //         tags_sort: "homeDecor,artsy,creative,customizable",
    //         tags_display: "homeDecor,creative,thoughtful",
    //         product_card_banner: "Customizable",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71Vvg7vYO6S._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100192,
    //         score: 0.34267646473608826,
    //         product_name: "Fjallraven Kånken Sling Backpack",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B082P1LGJX?th=1&linkCode=li3&tag=giftology02-20&linkId=264b8e54be9ddeb4bb2d87a2fe7304bf&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B082P1LGJX&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B082P1LGJX" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3OxQC68",
    //         flavor_text:
    //           "For when you like the look, but only want to carry a few things.",
    //         lab_results:
    //           "Lab Results:  A stylish and functional sling backpack to carry her essentials, perfect for school, trips, or exploring the city with a touch of Scandinavian design.",
    //         product_base_price: 81.62,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "trendy,durable,travel",
    //         tags_sort: "trendy,travel",
    //         tags_display: "travel,trendy,durable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81vknNMZ5xL._AC_SY625._SX._UX._SY._UY_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100173,
    //         score: 0.3416872725480392,
    //         product_name: "Gusto's Original Barbecue Rubs",
    //         category: "Sampler Kits",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/271135070/gustos-original-barbecue-rubs-of-the?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=spice+kit&ref=sr_gallery-1-8&frs=1&pop=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "The barbecue master looking to take things to the next level.",
    //         lab_results:
    //           "Lab Results: Before we get into the specifics, we should point out that Sampler Kits are some of the most popular items on the site, and for good reason. They are the perfect way to mix a thoughtful gift with a touch of excitement, and at relatively low-price points punch well above their weight.\n\nThis kit comes with 5 different spice that will add plenty of variety to your meal. If the recipient spends a lot of time barbecuing during the Summer or has decided to take the jump into smoking, this is a great add on gift.",
    //         product_base_price: 26.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "homeChef",
    //         tags: "fun",
    //         tags_sort: "delicious",
    //         tags_display: "samplerkits,delicious",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/6367773/r/il/d840fd/5509129376/il_fullxfull.5509129376_88im.jpg",
    //         listing_id: 271135070,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "Y",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 217,
    //         score: 0.3410659317554439,
    //         product_name: "Safecracker Math Puzzle",
    //         category: "Board Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Safecracker-Puzzle-Crack-Solve-Teaser/dp/B08B6DL9ZR?keywords=safecracker&qid=1692470617&sprefix=safecracker%2Caps%2C114&sr=8-3&linkCode=li3&tag=giftology02-20&linkId=daf96a940c1f2ba6d220c845c0eba63b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08B6DL9ZR&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B08B6DL9ZR" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3P3sSat",
    //         flavor_text:
    //           "Puzzle enthusiasts, math lovers, and those who seek brain-teasing challenges.",
    //         lab_results:
    //           "Lab Results: Unleash your inner codebreaker with this math puzzle. A fusion of numbers and strategy that promises mental gymnastics and triumphant solutions. Crack the code!",
    //         product_base_price: 24.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "boardGames",
    //         tags: "boardGames",
    //         tags_sort: "boardGames",
    //         tags_display: "boardGames",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/8173CmGyInL._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100160,
    //         score: 0.3395326247598813,
    //         product_name: "Custom Personalized Jigsaw Puzzle",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Custom-Personalized-Personal-Vertical-Art/dp/B08L5CQ24P?crid=X7CI1UXH9O5V&keywords=collage.com%2Bcustom%2Bmatte%2Bphoto%2Bpuzzles&qid=1652056567&sprefix=collage.com%2Bcustom%2Bmatte%2Bphoto%2Bpuzzles%2Caps%2C78&sr=8-6&th=1&linkCode=li2&tag=giftology02-20&linkId=81d5c84139c5bbbd17d87fdac89cec28&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08L5CQ24P&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08L5CQ24P" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3K5be2o",
    //         flavor_text:
    //           "Someone looking for a fun, interactive way to celebrate a memory.",
    //         lab_results:
    //           "Lab Results: Puzzles are a great way to spend an evening with family and friends, and the ability to select any picture you'd like really sets this gift apart. We also like this as a sleeper pick for a team building event. Select the right picture and have teams compete to who can complete the project the fastest.",
    //         product_base_price: 29.98,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "artsy,creative,thoughtful",
    //         tags_sort: "artsy,creative",
    //         tags_display: "justForFun,creative,thoughtful",
    //         product_card_banner: "Customizable",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71TzoOaHTjL._AC_SL1200_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100237,
    //         score: 0.33893584885604233,
    //         product_name: "Garden Tote",
    //         category: "Gardening",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/708260014/my-garden-personalized-garden-tote-and?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=gardening+shirt&ref=sr_gallery-1-48&pro=1&frs=1&organic_search_click=1",
    //         flavor_text:
    //           "Green-thumbed enthusiasts, plant caretakers, and those who want a stylish companion for their gardening endeavors.",
    //         lab_results:
    //           "Lab Results: Equip yourself for botanical adventures with this tote. A garden's worth of tools, all in one chic carrier. Cultivate your outdoor haven in style!",
    //         product_base_price: 48.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "gardening,organized,practical",
    //         tags_sort: "gardening,organized,practical",
    //         tags_display: "gardening,organized,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/11355547/r/il/d1dc3f/4655235420/il_fullxfull.4655235420_9xsb.jpg",
    //         listing_id: 708260014,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100128,
    //         score: 0.3377234425657586,
    //         product_name: "Engraved Luggage Tags",
    //         category: "Travel",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/749545471/luggage-tags-luggage-tag-personalized?utm_source=affiliate_window&utm_medium=affiliate&utm_campaign=ca_location_buyer&utm_content=215443&awc=6939_1644007875_63fae070b357cc40688725024c3057fd",
    //         flavor_text:
    //           "They'll smile every time their luggage rolls down the carousel.",
    //         lab_results:
    //           "Lab Results: These little tags are subtle yet recognizable, so you can avoid those awkward moments when you aren't quite sure which bag is yours. What makes this a great gift is the customizability of the tag, names and addresses are classic, but there's nothing stopping you from personalizing this for a little extra punch.\n\nThis gift is the perfect pairing for a ~~ID=“100129” text=“leather passport holder”~~.",
    //         product_base_price: 13,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "thoughtful,travel",
    //         tags_sort: "thoughtful,travel",
    //         tags_display: "travel,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/19638867/r/il/25848a/3587299176/il_fullxfull.3587299176_rzgl.jpg",
    //         listing_id: 749545471,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100212,
    //         score: 0.3374011607491045,
    //         product_name: "Leather Travel Case",
    //         category: "Travel",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1333559861/personalized-christmas-gift-travel-cable?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=travel&ref=sc_gallery-1-1&pro=1&sts=1&plkey=eb63fb4684dccdcbd65361fbba9625a34f03fef4%3A1333559861",
    //         flavor_text:
    //           "Jet-setters, organization obsessives, and those who demand style and function on the go.",
    //         lab_results:
    //           'Lab Results: Elevate your travel game with this chic leather case. It\'s a passport to organized bliss, holding your essentials in luxurious style. From toiletries to tech gadgets, this case has you covered. Its sleek design whispers sophistication, while its practicality shouts "ready for adventure." Carry your essentials in refined fashion, because a well-packed journey is a stylish one.',
    //         product_base_price: 50,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "trendy,durable,travel",
    //         tags_sort: "trendy,travel",
    //         tags_display: "trendy,durable,travel",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/22747213/r/il/f0f1d5/4336590137/il_fullxfull.4336590137_5lmc.jpg",
    //         listing_id: 1333559861,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100102,
    //         score: 0.33703105898894375,
    //         product_name: "Leather Desk Pad Protector",
    //         category: "Home Office",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Leather-Protector-Non-Slip-Blotter-Waterproof/dp/B088DB4MVZ?keywords=office%2Bassesorries&qid=1643403705&sprefix=office%2Bass%2Caps%2C209&sr=8-11&th=1&linkCode=li2&tag=giftology02-20&linkId=f14101e119afa3cbb18499daa732a37b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B088DB4MVZ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B088DB4MVZ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zmT5YG",
    //         flavor_text: "Classy neat freaks.",
    //         lab_results:
    //           "Lab Results: Hard to make a desk feel luxurious but this actually pulls it off. It's large enough to house all your keyboard and mouse, gives you a sort of boundary to keep things tidy. Pairs nicely with ~~ID=“100104” text=“a standing desk”~~.",
    //         product_base_price: 13.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "efficient,organized,homeOffice",
    //         tags_sort: "efficient,organized,homeOffice",
    //         tags_display: "homeOffice,efficient,organized",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61rbGIPKWAL._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100213,
    //         score: 0.3368950895642261,
    //         product_name: "Travel Sweater",
    //         category: "Travel",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1353386320/travel-sweater-adventure-sweater-world?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=travel&ref=sr_gallery-1-8&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Wanderlusters, comfort seekers, and those who want cozy style on the move.",
    //         lab_results:
    //           "Lab Results: This sweater's your passport to snug travels. It's versatile for chilly planes or cool cafes. Travel light, stay warm, and look effortlessly chic.",
    //         product_base_price: 45.8,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "travel",
    //         tags_sort: "trendy,travel",
    //         tags_display: "trendy,travel",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/37788861/r/il/1a894e/4424591954/il_fullxfull.4424591954_5n6h.jpg",
    //         listing_id: 1353386320,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100164,
    //         score: 0.33650353987080067,
    //         product_name: "Fairy Tale Bath Salt",
    //         category: "Bath and Body",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/911330581/fairy-tale-bath-salt-spa-gift-essentials?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=bath&ref=sr_gallery-1-4&pro=1&organic_search_click=1",
    //         flavor_text:
    //           "For the real-life princess who needs to relax in the bath.",
    //         lab_results:
    //           "Lab Results: There's something lovely about the presentation of these little bottles, with a dose of nostalgia included. These are great either as a bundle, or the perfect idea if you need something small for several recipients, think bridesmaids and bridal showers.\n\nLooking for something a little more over the top? Check out the ~~ID=“100168” text=“bath bombs”~~.",
    //         product_base_price: 6,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 5,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "relaxing,unexpected,bathAndBody",
    //         tags_sort: "bathAndBody,indoors",
    //         tags_display: "bathAndBody,relaxing,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/23683511/r/il/274420/5492314488/il_fullxfull.5492314488_icra.jpg",
    //         listing_id: 911330581,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100186,
    //         score: 0.33598448032608963,
    //         product_name: "Hoptimist Desk Ornament",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Hoptimist-9200140-Rot-Bimble/dp/B0073MUWQK?crid=DAQ4E6NASAJ1&keywords=hoptimist&qid=1663818341&sprefix=hoptimist%2Caps%2C87&sr=8-4&linkCode=li2&tag=giftology02-20&linkId=ecd3f50a03f25e3b1637bf8ca3ce0dbf&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0073MUWQK&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0073MUWQK" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40UH0Ws",
    //         flavor_text:
    //           "Anyone who needs a little symbol of upbeat positivity.",
    //         lab_results:
    //           "Lab Results: This cute little desk ornament has a surprisingly interesting pedigree. Designed in the early 1960's by Danish cabinetmaker Gustav Ehrenreich, this little desk toy helped launch the Danish happy movement. Today, Hoptimist donates money to the Danish Hospital Clowns organization for each one sold.\n\nLooking for a different kind of desk ornament? Try this ~~ID=“100182” text=“Japanese wooden puzzle”~~.",
    //         product_base_price: 32,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "artsy,creative,thoughtful",
    //         tags_sort: "artsy,creative",
    //         tags_display: "justForFun,creative,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/714N+qI+ZYL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100231,
    //         score: 0.33547318071039384,
    //         product_name: "Hummingbird House",
    //         category: "Gardening",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Hummingbird-Outdoor-Swinging-Natural-Outside/dp/B0BYMMCZBT?crid=3THH9R8B7288H&keywords=hummingbird%2Bhouse&qid=1692464266&sprefix=hummingbird%2Bhouse%2Caps%2C126&sr=8-5&th=1&linkCode=li3&tag=giftology02-20&linkId=159bdb8e72fbae5c71bee78ef1281cd4&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BYMMCZBT&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0BYMMCZBT" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/45BXpkW",
    //         flavor_text:
    //           "Nature lovers, bird enthusiasts, and those who want to provide a charming oasis for their feathered friends.",
    //         lab_results:
    //           "Lab Results: Invite the delicate beauty of hummingbirds into your world with this house. A whimsical haven where nature's jewels can rest and enchant. Welcome avian wonders!",
    //         product_base_price: 15.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "gardening",
    //         tags_sort: "gardening",
    //         tags_display: "gardening",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/717-RbMfhuL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100089,
    //         score: 0.33546555780191706,
    //         product_name: "The Trail Journal",
    //         category: "Camping",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/710475099/the-trail-journal-prompted-hiking-log?click_key=3860c870aa2a9caf0194071772a8572522fcc548%3A710475099&click_sum=c6514d6c&ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=outdoors&ref=sr_gallery-1-2&organic_search_click=1&pop=1",
    //         flavor_text: "A unique way to remember your hikes and trails.",
    //         lab_results:
    //           "Lab Results: Sometimes it's easy to forget all the wonderful times you've spent out on the trail. A trail journal is a great way to make sure you are recording your memories. For the person that really enjoys both writing and hiking, this is a great gift.",
    //         product_base_price: 10,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "thoughtful",
    //         hobbies_interests: "camping",
    //         tags: "thoughtful",
    //         tags_sort: "outdoors",
    //         tags_display: "camping,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/5574196/r/il/800f39/5552347494/il_fullxfull.5552347494_jewb.jpg",
    //         listing_id: 710475099,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100129,
    //         score: 0.3351681721764777,
    //         product_name: "Personalized Leather Passport Holder",
    //         category: "Travel",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/622266450/leather-passport-cover-personalized?utm_source=affiliate_window&utm_medium=affiliate&utm_campaign=ca_location_buyer&utm_content=215443&awc=6939_1644007883_5c28aad6973db3a9d742876a121796a6",
    //         flavor_text:
    //           "For the person who wonders, what if customs was more fun?",
    //         lab_results:
    //           "Lab Results: Hear me out, I think passports as a concept are actually pretty cool. They're these little books that help grant you access to other countries, and help you keep track of all the places you've been. In a sense, they're part of your story. All that said, they certainly don't look and feel as cool as they are on paper. Adding a customized leather holder fixes that problem, elevating a boring piece of paperwork to something special.\n\nThis gift is the perfect pairing for an ~~ID=“100129” text=“engraved luggage tag”~~.",
    //         product_base_price: 17.62,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,thoughtful",
    //         hobbies_interests: "",
    //         tags: "thoughtful,travel",
    //         tags_sort: "thoughtful,travel",
    //         tags_display: "travel,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/11739370/r/il/c51377/1635991629/il_fullxfull.1635991629_b7hu.jpg",
    //         listing_id: 622266450,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100233,
    //         score: 0.3339507267262607,
    //         product_name: "Scissors & Pruners",
    //         category: "Gardening",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/926749634/scissors-pruners-set-houseplants-and?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=gardening&ref=sc_gallery-1-9&etp=1&plkey=1e341215327bde2d9c0142481012c2cf4ea3ee7e%3A926749634",
    //         flavor_text:
    //           "Gardeners, plant caretakers, and those who wield blades with precision to nurture botanical beauty.",
    //         lab_results:
    //           "Lab Results: Master your garden with these carbon steel tools. Prune, snip, and shape with the finesse of a horticultural virtuoso. Cultivate with craftsmanship!",
    //         product_base_price: 22.5,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "gardening",
    //         tags_sort: "gardening",
    //         tags_display: "gardening",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/25106288/r/il/6ac6e1/4490907556/il_fullxfull.4490907556_3cxq.jpg",
    //         listing_id: 926749634,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100196,
    //         score: 0.3338899976902817,
    //         product_name: "Custom Pet Portrait - Cats",
    //         category: "Cats",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Create-Customize-Poster-Portrait-Landscape/dp/B0BZQGVCQT?crid=38SNR6QOFV41Y&keywords=pet%2Bportrait&qid=1692210750&sprefix=pet%2Bportrait%2Caps%2C116&sr=8-6&th=1&linkCode=li3&tag=giftology02-20&linkId=6c58468f21992e57c13446532d3c4b4b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BZQGVCQT&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0BZQGVCQT" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3Yzrcst",
    //         flavor_text: "For the cat that deserves it. (Yours does.)",
    //         lab_results:
    //           "Lab Results:  People love their pets, and a custom portrait allows them to immortalize them. Great for new kittens and old cats alike.",
    //         product_base_price: 19.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "cats",
    //         tags: "cats,books",
    //         tags_sort: "cats",
    //         tags_display: "cats,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81auqRYA4BL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100235,
    //         score: 0.33252006328468425,
    //         product_name: "Cottagecore T-Shirt",
    //         category: "Gardening",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1448008741/cottagecore-vintage-flowers-comfort?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=gardening+shirt&ref=sr_gallery-1-26&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Nature romantics, floral enthusiasts, and those who want to wear the whimsical charm of cottage gardens.",
    //         lab_results:
    //           "Lab Results: Blossom into cottagecore dreams with this shirt. A canvas of flowers that whispers of idyllic meadows and rustic retreats. Wear nature's poetry!",
    //         product_base_price: 30.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "gardening",
    //         tags_sort: "gardening",
    //         tags_display: "gardening",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/22376108/r/il/7c59a0/5415860930/il_fullxfull.5415860930_opn8.jpg",
    //         listing_id: 1448008741,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100195,
    //         score: 0.33153556522557276,
    //         product_name: "Custom Pet Portrait - Dogs",
    //         category: "Dogs",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Create-Customize-Poster-Portrait-Landscape/dp/B0BZQGVCQT?crid=38SNR6QOFV41Y&keywords=pet%2Bportrait&qid=1692210750&sprefix=pet%2Bportrait%2Caps%2C116&sr=8-6&th=1&linkCode=li3&tag=giftology02-20&linkId=6c58468f21992e57c13446532d3c4b4b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0BZQGVCQT&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0BZQGVCQT" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3YGq6v4",
    //         flavor_text: "For the dog that deserves it. (Yours does.)",
    //         lab_results:
    //           "Lab Results:  People love their pets, and a custom portrait allows them to immortalize them. Great for new puppies and old dogs alike.",
    //         product_base_price: 19.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "dogs",
    //         tags: "dogs",
    //         tags_sort: "dogs",
    //         tags_display: "dogs,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/811-rayUQQL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100016,
    //         score: 0.3315072435186852,
    //         product_name: "WÜSTHOF CLASSIC IKON 8 Inch Chef’s Knife",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Wusthof-4596-7-20-4596-7-20-Knife/dp/B000YMURSE?dchild=1&keywords=wusthof%2Bclassic%2Bikon&qid=1624038319&s=industrial&sr=1-8&th=1&linkCode=li2&tag=giftology02-20&linkId=905bef4183d2d930e7cd97bf49e5688f&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B000YMURSE&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B000YMURSE" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3ZASIV4",
    //         flavor_text: "Anyone who loves to cook, and most people who don’t.",
    //         lab_results:
    //           "Lab Results: This is the number one gift we recommend for any home chef. If they don't have one, they need one.\n\nLike the idea but looking for something more affordable? Check out the ~~ID=“100012” text=“Victorinox Pro”~~ our budget picket in this category.",
    //         product_base_price: 180,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "homeChef",
    //         tags: "mustOwn,practical,efficient",
    //         tags_sort: "practical,efficient,indoors",
    //         tags_display: "homeChef,mustOwn,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61tnteH-lIL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "LINK",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100003,
    //         score: 0.3300440832589252,
    //         product_name: "PETZL - TIKKINA Headlamp",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/PETZL-TIKKINA-Headlamp-Standard-Lighting/dp/B01KYTRHLQ?dchild=1&keywords=Petzl%2BTikkina%2BHeadlamp&qid=1626036560&s=sporting-goods&sr=1-5&th=1&linkCode=li2&tag=giftology02-20&linkId=b491eb7374f2dfb02f2e444764bf976e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01KYTRHLQ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01KYTRHLQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3JZUYj7",
    //         flavor_text: "Campers who just need a basic headlamp.",
    //         lab_results:
    //           "Lab Results: The TIKKINA doesn't have all the bells and whistles of our favorite headlamp, ~~ID=“100002” text=“PETZL ACTIK CORE”~~, but it's a great starter option and one of the best values amongst small headlamps. Easy to use with only a single button controlling its low, medium, and high settings, but lacks the red light of its more robust cousin. Still, the battery life is excellent, and sometimes that's all you need from a headlamp.\n\nWe recommend this gift for someone who is new to the hiking and camping seen and might not have one already.",
    //         product_base_price: 19.74,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "camping",
    //         tags: "affordable",
    //         tags_sort: "outdoors",
    //         tags_display: "camping,affordable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71MKm+dJqgL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100232,
    //         score: 0.3299059239291135,
    //         product_name: "Four Piece Garden Set",
    //         category: "Gardening",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/595299813/4-piece-garden-set-personalized-garden?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=gardening&ref=sc_gallery-1-12&frs=1&etp=1&sts=1&plkey=7b87057c7b7bfe5cc53f9e1ac7b6f6730659172d%3A595299813",
    //         flavor_text:
    //           "Green thumbs, outdoor enthusiasts, and anyone who wants to cultivate their garden oasis with a personal touch.",
    //         lab_results:
    //           "Lab Results: Craft your garden haven with this customizable set. Plant, prune, and bloom in style. Let your outdoor space reflect your unique taste and creativity. Cultivate with flair!",
    //         product_base_price: 43.98,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "gardening",
    //         tags: "gardening",
    //         tags_sort: "gardening",
    //         tags_display: "gardening",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/6528210/r/il/01bb72/1433296826/il_fullxfull.1433296826_5df2.jpg",
    //         listing_id: 595299813,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100105,
    //         score: 0.32958088065078933,
    //         product_name: "Elitehood Ring Light for Computer",
    //         category: "Home Office",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Elitehood-Weighted-Computer-Recording-Photography/dp/B087CMTRV5?crid=2RXYT0XBE1T0H&keywords=elitehood%2Bring&qid=1643404229&sprefix=elitehood%2Bring%2Caps%2C138&sr=8-1&th=1&linkCode=li2&tag=giftology02-20&linkId=701d263a1e534703e6e8875bab4b0734&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B087CMTRV5&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B087CMTRV5" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/431N8hM",
    //         flavor_text: "A Gift to show your best side.",
    //         lab_results:
    //           "Lab Results: Looking for the most cost-effective way to improve your Zoom persona? Get the right light to avoid being too dark or washed out.\n\nAlternatively, upgrade your background with a ~~ID=“100080” text=“classy bookend”~~.",
    //         product_base_price: 27.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "",
    //         tags: "efficient,organized,homeOffice",
    //         tags_sort: "efficient,organized,homeOffice",
    //         tags_display: "homeOffice,efficient,organized",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71Vm+o5eeqS._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100106,
    //         score: 0.3295080943774294,
    //         product_name: "Fitueyes Dual Monitor Stand",
    //         category: "Home Office",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B07CWL1GR3?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=ba6e152c7edc6d1939146b64075d2c83&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07CWL1GR3&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07CWL1GR3" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42WmDtX",
    //         flavor_text:
    //           "For everyone that has their monitors sitting on a pile of books. We see you.",
    //         lab_results:
    //           "Lab Results: This falls into that bucket of very practical and not very flashy, so it might work best as something you add to your own Christmas list. Still, if you're tired of raising your monitors using old books, these are super handy.",
    //         product_base_price: 29.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "efficient,organized,homeOffice",
    //         tags_sort: "efficient,organized,homeOffice",
    //         tags_display: "homeOffice,efficient,organized",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/91BZKc4DPYS._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100228,
    //         score: 0.3281045821108067,
    //         product_name: "Leather Desk Mat",
    //         category: "Home Office",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1234252626/leather-desk-mat-custom-size-desk-pad?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=&ref=sc_gallery-1-3&pro=1&frs=1&sts=1&plkey=72c8bc8779ccd25839a8b3f9922b5d5a56c47d60%3A1234252626",
    //         flavor_text:
    //           "Workspace connoisseurs, minimalists, and those who believe in elegance beneath their fingertips.",
    //         lab_results:
    //           "Lab Results: Elevate your desk aesthetic with this leather mat. Smooth luxury for your workspace, where style meets function. Work with grace!",
    //         product_base_price: 56,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "efficient,organized,homeOffice",
    //         tags_sort: "efficient,organized,homeOffice",
    //         tags_display: "homeOffice,efficient,organized",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/30311395/r/il/847d17/3932509704/il_fullxfull.3932509704_6v0s.jpg",
    //         listing_id: 1234252626,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100103,
    //         score: 0.3275364965861098,
    //         product_name: "U Brands Glass Dry Erase Board",
    //         category: "Home Office",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B00PRZ3PMS?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=5da7070156eade926bf051d34f2365c6&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00PRZ3PMS&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00PRZ3PMS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3ZydvZu",
    //         flavor_text:
    //           "Think of this as an upgrade for that warped plastic whiteboard in your office.",
    //         lab_results:
    //           "Lab Results: White boards are great, but if you're willing to spend a little more these are a far superior experience. Glass dry erase boards never warp, are easier to erase, and in our opinion just look cooler.",
    //         product_base_price: 80.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "",
    //         tags: "efficient,organized,homeOffice",
    //         tags_sort: "efficient,organized,homeOffice",
    //         tags_display: "homeOffice,efficient,organized",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/11hZLKQy+5L._AC_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100205,
    //         score: 0.3275205010105394,
    //         product_name: "Cats And Coffee Shirt",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1302581484/i-like-cats-and-coffee-shirt-coffee?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=coffee&ref=sr_gallery-1-7&pro=1&organic_search_click=1",
    //         flavor_text:
    //           "Proud cat aficionados, caffeine devotees, and those who believe life is best lived with a feline friend and a cup of joe.",
    //         lab_results:
    //           "Lab Results: Wear your passions loud and clear with this purrfect tee. It's the ultimate conversation starter, inviting fellow cat lovers and coffee addicts to unite in camaraderie. The shirt is as cozy as a cat's nap spot and as comforting as a warm mug of coffee. Express yourself stylishly and tell the world, \"I like cats, I like coffee, and I'm not kitten around.\"",
    //         product_base_price: 11.7,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "cats,coffee",
    //         tags_sort: "cats,coffee",
    //         tags_display: "cats,coffee",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/30322294/r/il/cb506b/4260565269/il_fullxfull.4260565269_lmjc.jpg",
    //         listing_id: 1302581484,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100088,
    //         score: 0.32527640653469475,
    //         product_name: "Wise Owl Camping Hammock",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Wise-Owl-Outfitters-Hammock-Hammocks/dp/B01E3EHRVS?keywords=hammock&qid=1642995997&sr=8-5&linkCode=li2&tag=giftology02-20&linkId=ffd858bc451553cf0b64161b63ddafdd&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01E3EHRVS&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01E3EHRVS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40yahGR",
    //         flavor_text: "Kick back and relax between two trees.",
    //         lab_results:
    //           "Lab Results: Hammocks generally aren't the first thing you grab when setting out for a camping trip. I'd venture to bet a good camping pad is the first thing most people buy after their first camping trip after vowing to never sleep directly on the ground again. Still, even a great pad leaves you wondering if there is a better way, and there is.\n\nSpending a night outdoors in a hammock will have you wondering why we bothered inventing the mattress in the first place. They're extremely lightweight, yet far more comfortable than you'd imagine. You owe it to yourself to try one out. This model in particular is great because it comes with easy-to-use tree straps and can be set up in less time than it takes to find the right set of trees.\n\nUp for a challenge? Lose the tree straps, grab some paracord, and learn to tie some knots. I recommend the bowline and taught line hitch for anyone interested in the craft. Check out this ~~ID=“100174” text=“handy guide”~~ for inspiration.\n",
    //         product_base_price: 26.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "camping",
    //         tags: "fun,cozy",
    //         tags_sort: "cozy,outdoors",
    //         tags_display: "camping,fun,cozy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81oYv5ORgbL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100161,
    //         score: 0.3235927291988675,
    //         product_name: "Personalized Wood Cutting Board",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Personalized-Cutting-Board-Warming-Wedding/dp/B01CPZ8Q7G?crid=30Y5RQYGQF7LL&keywords=personalized+wood+cutting+board&qid=1652056635&sprefix=personalized+wood+cutting+board%2Caps%2C89&sr=8-13&linkCode=li2&tag=giftology02-20&linkId=e4421977db028d591f2690f4fecf5a16&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01CPZ8Q7G&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01CPZ8Q7G" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40x2ER2",
    //         flavor_text: "We like this one for new homeowners.",
    //         lab_results:
    //           "Lab Results: There's something really classy about a wood cutting board, and the big benefit here is the option to customize it to your liking. Maybe the family surname, their initials, or a meaningful quote. In any case, this combines beauty, function, and a certain thoughtfulness that is sure to please.\n\nIf you're in the market for a cutting board, we always recommend a ~~ID=“100016” text=“chef's knife”~~ to any home chef who doesn't have one.",
    //         product_base_price: 34.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "homeChef",
    //         tags: "practical,thoughtful",
    //         tags_sort: "practical,indoors,customizable",
    //         tags_display: "homeChef,practical,thoughtful",
    //         product_card_banner: "Customizable",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/514BsMTCbhL.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 219,
    //         score: 0.32272243175672066,
    //         product_name: "Clearly Impossible Puzzle",
    //         category: "Board Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Clear-Difficult-Puzzle-100-Pieces/dp/B0882KGHHT?keywords=impossible%2Bpuzzle&qid=1692470852&s=toys-and-games&sprefix=impossible%2B%2Ctoys-and-games%2C111&sr=1-4&th=1&linkCode=li3&tag=giftology02-20&linkId=735d6a89e70e3a95ee8cf9bc8cb9c551&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0882KGHHT&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0882KGHHT" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3P30hBT",
    //         flavor_text:
    //           "Puzzle masters, optical illusion fans, and those who thrive on mind-bending challenges.",
    //         lab_results:
    //           "Lab Results: Dive into the depths of visual deception with this puzzle. A transparent enigma that challenges your perception and teases your mind. Embrace the impossible!",
    //         product_base_price: 16.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "boardGames",
    //         tags: "boardGames",
    //         tags_sort: "boardGames",
    //         tags_display: "boardGames",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61WibtiaYGL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100133,
    //         score: 0.32251971655419737,
    //         product_name: "World Bucket List - Scratch Off Print",
    //         category: "Travel",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/714858310/world-bucket-list-scratch-off-print?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=travel&ref=sc_gallery-1-1&pro=1&frs=1&sts=1&listing_id=714858310&listing_slug=world-bucket-list-scratch-off-print&plkey=39ad1629e8390f8ed07e4e29efe29f1835fc148d%3A714858310",
    //         flavor_text: "For those IRL completionists.",
    //         lab_results:
    //           "Lab Results: This is as much a gift as it is a promise to see the world. There is somethign especially satisfying about coming home from a trip and scratching off a new location.\n\nLike the idea but want something more classic? Try this ~~ID=“100126” text=“push pin map”~~.",
    //         product_base_price: 33.3,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "fun,thoughtful,travel",
    //         tags_sort: "thoughtful,travel",
    //         tags_display: "travel,fun,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/9633435/r/il/786537/4579794835/il_fullxfull.4579794835_4oet.jpg",
    //         listing_id: 714858310,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100169,
    //         score: 0.3192436249358844,
    //         product_name: "After Shower & Bath Oil",
    //         category: "Bath and Body",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/767070469/after-shower-bath-oil?ga_order=highest_reviews&ga_search_type=all&ga_view_type=gallery&ga_search_query=bath&ref=sc_gallery-1-1&plkey=c8603eadf451717a1b20098efe53875a687d56a6%3A767070469",
    //         flavor_text: "Who doesn't love smooth skin?",
    //         lab_results:
    //           "Lab Results: These little homemade bottles of oil smell great and are just the thing after a hot shower.",
    //         product_base_price: 11.11,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "relaxing,unexpected,bathAndBody",
    //         tags_sort: "bathAndBody,indoors",
    //         tags_display: "bathAndBody,relaxing,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/22004475/r/il/117d04/2138663560/il_fullxfull.2138663560_f118.jpg",
    //         listing_id: 767070469,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "Y",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 2,
    //         score: 0.3153314782000382,
    //         product_name: "PETZL - ACTIK CORE Headlamp",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B07T5RLZTX?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=5c04a95ec284cb4ad1ab062af4832f2f&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07T5RLZTX&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07T5RLZTX" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3ZE9Id3",
    //         flavor_text:
    //           "Anyone looking for a reliable, hands-free light source, with some excellent features.",
    //         lab_results:
    //           "Lab Results: If you aren't too into camping a headlamp might seem like an unusual gift, but anyone who's ever wandered around a campsite at night knows why they regularly come up on lists of essential camping goods. The ACTIK CORE represents the higher end of what a good head lamp should offer. It's lightweight, plenty powerful, and includes a red light feature that protects your night vision. We also love the rechargeable battery, giving you the opportunity to be ready for your next trip with a quick recharge instead of a run to the store.\n\nIf all they have is a cheap lamp from their first hike or camping trip, this will feel like a big upgrade, and that makes it a great gift.\n\nLooking for something for a first-time camper? Check out the ~~ID=“100003” text=“PETZL TIKKINA”~~ as our budget option.",
    //         product_base_price: 69.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "camping",
    //         tags: "upgrade",
    //         tags_sort: "outdoors",
    //         tags_display: "camping,upgrade",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/718Hr8Gt1YL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100204,
    //         score: 0.3145947029812108,
    //         product_name: "Personalized Tumbler",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1419432961/personalized-tumbler-with-name-gift-for?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=coffee&ref=sr_gallery-1-2&pro=1&frs=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Coffee connoisseurs, tea enthusiasts, and anyone on a first-name basis with their favorite beverage.",
    //         lab_results:
    //           "Lab Results: Say goodbye to those \"Is this my drink?\" moments. With this personalized tumbler, your beverage will always sport your name in style. It's like a VIP pass for your morning pick-me-up. Plus, it's spill-proof, so you can confidently sashay through your day without fearing accidental coffee showers. Sip smart, sip personalized.",
    //         product_base_price: 20.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "coffee,tea",
    //         tags_sort: "coffee,tea",
    //         tags_display: "coffee,tea",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/41028673/r/il/39235e/5333210769/il_fullxfull.5333210769_fozr.jpg",
    //         listing_id: 1419432961,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100214,
    //         score: 0.3135985186172353,
    //         product_name: "New Board Game Smell Candle",
    //         category: "Board Games",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1215322164/new-board-game-smell-scentedcandle-9oz?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=board+games&ref=sr_gallery-1-8&frs=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Board game enthusiasts, nostalgia hunters, and those who adore the scent of fun.",
    //         lab_results:
    //           "Lab Results: Capture the magic of freshly opened board games with this candle. Aromatic nostalgia, perfect for cozy game nights. Ignite the joy of play!",
    //         product_base_price: 29.63,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "boardGames",
    //         tags: "boardGames",
    //         tags_sort: "boardGames",
    //         tags_display: "boardGames",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/34221639/r/il/7b8ef2/3986534881/il_fullxfull.3986534881_g8q6.jpg",
    //         listing_id: 1215322164,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100130,
    //         score: 0.3123241001490583,
    //         product_name: "Digital Luggage Scale",
    //         category: "Travel",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Luxebell-110lbs-Digital-Luggage-Scale/dp/B00O9R7DIW?keywords=portable%2Bluggage%2Bscale&qid=1640293770&sr=8-3-spons&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyR1JMN1gwQURGSjBIJmVuY3J5cHRlZElkPUEwMDU0NTgwN01TVUZJNFRaT1FUJmVuY3J5cHRlZEFkSWQ9QTAxMDEyNzJDUlIwV05XVllINkcmd2lkZ2V0TmFtZT1zcF9hdGYmYWN0aW9uPWNsaWNrUmVkaXJlY3QmZG9Ob3RMb2dDbGljaz10cnVl&th=1&linkCode=li2&tag=giftology02-20&linkId=f1378461cb77773f38691ae65f3e71f4&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00O9R7DIW&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00O9R7DIW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3lWHcWo",
    //         flavor_text: "Every home should have one of these.",
    //         lab_results:
    //           "Lab Results: We have to be careful here as this one is a pure practicality play. We only recommend this one as a gift if you're sure that travel is a core part of their psyche. Still, if it is it could be  home run.",
    //         product_base_price: 11.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "essential,practical,travel",
    //         tags_sort: "practical,travel",
    //         tags_display: "travel,essential,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61ledwy+gcL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100199,
    //         score: 0.3109713830439031,
    //         product_name: "Witches Brew Sweatshirt",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1277909074/witches-brew-sweatshirthalloween?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=coffee+sweater&ref=sc_gallery-1-10&pro=1&plkey=77252f9cc3da18eeb88dcac73f0759b22f43bd46%3A1277909074",
    //         flavor_text: "For literal witches.",
    //         lab_results:
    //           "Lab Results:  Comfy, quirky, and speaks to their inner witch.",
    //         product_base_price: 17.9,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "fashion,coffee",
    //         tags_sort: "coffee,quirky",
    //         tags_display: "fashion,coffee,quirky",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/34588671/r/il/4ca359/4105015300/il_fullxfull.4105015300_s1fc.jpg",
    //         listing_id: 1277909074,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 218,
    //         score: 0.3103282077454559,
    //         product_name: "Tree of Life Puzzle",
    //         category: "Board Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B0C39Y7GJR?psc=1&pd_rd_i=B0C39Y7GJR&pd_rd_w=Odd3y&content-id=amzn1.sym.f734d1a2-0bf9-4a26-ad34-2e1b969a5a75&pf_rd_p=f734d1a2-0bf9-4a26-ad34-2e1b969a5a75&pf_rd_r=N30G1WMD8JPEZ8SWZN2R&pd_rd_wg=wENZ1&pd_rd_r=eebbce98-718f-49c1-87ce-5577cd667010&s=toys-and-games&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw&linkCode=li3&tag=giftology02-20&linkId=c40730b48c93057c3f7350f8eeb23248&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0C39Y7GJR&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0C39Y7GJR" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/44bw5Ji",
    //         flavor_text:
    //           "Puzzle devotees, nature admirers, and those who seek to piece together the beauty of life.",
    //         lab_results:
    //           "Lab Results: Embark on a circular journey with this puzzle. A mesmerizing fusion of art and challenge that captures the essence of the Tree of Life. Connect the branches!",
    //         product_base_price: 29.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "boardGames",
    //         tags: "boardGames",
    //         tags_sort: "boardGames",
    //         tags_display: "boardGames",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/810eFBjNIEL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100216,
    //         score: 0.3103282077454559,
    //         product_name: "Beautiful Day T-Shirt",
    //         category: "Board Games",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1376852827/its-a-beautiful-day-for-board-games?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=board+games&ref=sr_gallery-1-37&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Gaming aficionados, indoor adventurers, and those who turn any day into a game day.",
    //         lab_results:
    //           "Lab Results: Embrace your game-loving spirit with this tee. It turns any day into a potential board game extravaganza. Make every day a play day!",
    //         product_base_price: 29.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "boardGames",
    //         tags: "boardGames",
    //         tags_sort: "boardGames",
    //         tags_display: "boardGames",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/25041895/r/il/35bff2/4453816618/il_fullxfull.4453816618_je66.jpg",
    //         listing_id: 1376852827,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100215,
    //         score: 0.3103282077454559,
    //         product_name: "Sorry Board Game T-Shirt",
    //         category: "Board Games",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1365988101/sorry-for-what-i-said-while-playing?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=board+games&ref=sr_gallery-1-17&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Game night enthusiasts, competitive spirits, and those who believe in post-game apologies.",
    //         lab_results:
    //           "Lab Results: Declare board game accountability with humor. This shirt's a badge of post-game reconciliation. Own your game night antics!",
    //         product_base_price: 29.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "boardGames",
    //         tags: "boardGames",
    //         tags_sort: "boardGames",
    //         tags_display: "boardGames",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/25041895/r/il/3053a7/4420187834/il_fullxfull.4420187834_hcgt.jpg",
    //         listing_id: 1365988101,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100207,
    //         score: 0.3018301714261906,
    //         product_name: "Japanese Ceramic Mug",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1336702325/coffee-mug-japanese-hand-crafted?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=coffee&ref=sr_gallery-1-19&pro=1&frs=1&organic_search_click=1",
    //         flavor_text:
    //           "Artisans at heart, tea aficionados, and anyone who dreams of holding a piece of Japan's serene beauty in their hands.",
    //         lab_results:
    //           "Lab Results: Elevate your sipping experience with this meticulously crafted ceramic masterpiece. This mug isn't just a vessel; it's a work of art. Every curve and brushstroke tells a story of tradition and attention to detail. Whether you're sipping green tea or your morning brew, each sip becomes a meditative journey into the heart of Japanese craftsmanship. Indulge in the essence of elegance as you cradle your very own piece of tranquility.",
    //         product_base_price: 72.63,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "coffee,tea",
    //         tags_sort: "coffee,tea",
    //         tags_display: "coffee,tea",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/37513338/r/il/8f056c/4308604610/il_fullxfull.4308604610_g11q.jpg",
    //         listing_id: 1336702325,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100211,
    //         score: 0.30175864459167523,
    //         product_name: "Tea-Rex",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/shirt-Dinosaur-Cartoon-Lover-T-Shirt/dp/B08FN83GLD?keywords=tea-rex%2Bshirt&qid=1692463722&sprefix=tea-rex%2Caps%2C126&sr=8-1&customId=B0752XK16C&customizationToken=MC_Assembly_1%23B0752XK16C&th=1&linkCode=li3&tag=giftology02-20&linkId=a500e89d13cd2347312958e5523486aa&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08FN83GLD&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B08FN83GLD" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3E42R4A",
    //         flavor_text:
    //           "Dinosaur enthusiasts, tea lovers, and those who believe in embracing their inner fierceness with a touch of humor.",
    //         lab_results:
    //           "Lab Results: Roar your love for tea with a prehistoric twist in the \"Tea-Rex\" tee. This shirt is like a time machine that combines the majesty of a T-Rex with the comfort of your favorite tea mug. Whether you're a herbal herbivore or a caffeinated carnivore, this shirt lets you show off your dual nature. It's a reminder that even the mightiest creatures appreciate the soothing sip of tea.",
    //         product_base_price: 18.99,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "tea",
    //         tags_sort: "fashion,tea,quirky",
    //         tags_display: "fashion,tea,quirky",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/B1vjL6MUg1S._CLa%7C2140%2C2000%7C71OmZtywL4L.png%7C0%2C0%2C2140%2C2000%2B0.0%2C0.0%2C2140.0%2C2000.0_AC_SX679._SX._UX._SY._UY_.png",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100201,
    //         score: 0.30087774736234896,
    //         product_name: "Coffee Dog Sweatshirt",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1411676912/coffee-dog-mom-sweatshirt-mothers-day?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=coffee&ref=sr_gallery-1-4&pro=1&organic_search_click=1",
    //         flavor_text: "Dog mom's that dig coffee.",
    //         lab_results:
    //           "Lab Results:  Another comfy sweater that says hey, you like dogs and coffee.",
    //         product_base_price: 32,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "fashion,coffee",
    //         tags_sort: "coffee,quirky",
    //         tags_display: "fashion,coffee,quirky",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/27577677/r/il/0ed995/4665577574/il_fullxfull.4665577574_5hij.jpg",
    //         listing_id: 1411676912,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100170,
    //         score: 0.2977290991399264,
    //         product_name: "Luxury Bathtub Caddy",
    //         category: "Bath and Body",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B01C4IS4Q2?ascsubtag=4390637%2C11%2C27%2Cd%2C0%2C0%2Cgoogle%2C776%3A1%3B962%3A1%3B901%3A2%3B900%3A2%3B974%3A3%3B994%3A3%2C16363357%2C0%2C0&th=1&linkCode=li2&tag=giftology02-20&linkId=1421cae118d0460111b15d34aa578508&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01C4IS4Q2&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01C4IS4Q2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U2B6QP",
    //         flavor_text: "For someone who deserves to relax in luxury",
    //         lab_results:
    //           "Lab Results: Versatile setup for taking a relaxing bath with candle slots, storage trays, and beverage holders.",
    //         product_base_price: 57.97,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "relaxing,unexpected,bathAndBody",
    //         tags_sort: "bathAndBody,indoors",
    //         tags_display: "bathAndBody,relaxing,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71rEgoSBqoL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 4,
    //         score: 0.2974553535254362,
    //         product_name: "Mountain Hardwear Stretch Ozonic Jacket",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B082QML2Y6?ie=UTF8&th=1&psc=1&linkCode=li2&tag=giftology02-20&linkId=97ba824c24ce9285631cf0f0f2244931&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B082QML2Y6&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B082QML2Y6" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U13CCw",
    //         flavor_text: "Anyone that’s had bad weather mess up a great trip.",
    //         lab_results:
    //           "Lab Results: Serious campers know few things are as important as your rain gear. The Ozonic blends a waterproof, functional exterior with a comfy fit. ",
    //         product_base_price: 199.97,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "camping",
    //         tags: "durable",
    //         tags_sort: "outdoors",
    //         tags_display: "camping,durable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/716Qa5RPkzL._AC_UX679_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100210,
    //         score: 0.2966330137865302,
    //         product_name: "Suriel Tea Co",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1431503544/suriel-tea-co-tshirt-acotar-sweater?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=tea+tshirt&ref=sc_gallery-1-3&pro=1&sts=1&plkey=4444a31c64f6633a126835c3d5ed02c98386f7ea%3A1431503544",
    //         flavor_text:
    //           "Witchy souls, tea leaf readers, and anyone who believes in the magical blend of spells and steeped leaves.",
    //         lab_results:
    //           "Lab Results: Unveil your mystical side. It's a fusion of enchantment and elegance, just like a potent brew from the cauldron of a skilled witch. Whether you're stirring potions or sipping chamomile, this shirt embodies the mystical aura of a bewitching evening. Let your outfit cast a spell as powerful as your favorite tea, and embrace the whispers of the arcane as you traverse between the realms of fashion and magic.",
    //         product_base_price: 11.84,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "tea",
    //         tags_sort: "fashion,tea,quirky",
    //         tags_display: "fashion,tea,quirky",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/36786259/r/il/03c056/4799686693/il_fullxfull.4799686693_8t92.jpg",
    //         listing_id: 1431503544,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100188,
    //         score: 0.29614532782396435,
    //         product_name: "Palais des Thés - Signature Classics",
    //         category: "Sampler Kits",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Palais-Signature-Classics-Indulgence-Tubes/dp/B00FV8LV4U?keywords=tea%2Bfrom%2Baround%2Bthe%2Bworld&qid=1669574639&sr=8-57&th=1&linkCode=li2&tag=giftology02-20&linkId=32d79435d4154f6f617de6664ed12612&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00FV8LV4U&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00FV8LV4U" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3GbuSZs",
    //         flavor_text:
    //           "Someone with the spirit of adventure, that also happens to like tea.",
    //         lab_results:
    //           "Lab Results: Before we get into the specifics, we should point out that Sampler Kits are some of the most popular items on the site, and for good reason. They are the perfect way to mix a thoughtful gift with a touch of excitement, and at relatively low-price points punch well above their weight.\n\nThere's something inherently relaxing and contemplative about a hot cup of tea. This tea sampler kit provides a variety of flavors in cute packaging that will have them thinking of you every time they take a sip.",
    //         product_base_price: 31,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "tea,fun",
    //         tags_sort: "tea,delicious",
    //         tags_display: "samplerkits,tea,delicious",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/5162tiQfW-L._SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100064,
    //         score: 0.2959671575360621,
    //         product_name: "Sushi Socks Box",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B0776XCN86?ascsubtag=AwEAAAAAAAAAAdy9&linkCode=li2&tag=giftology02-20&linkId=841cb53e94d25c938508f8964116c3ed&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0776XCN86&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0776XCN86" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U2YBJv",
    //         flavor_text: "Three cats in a trench coat.",
    //         lab_results:
    //           "Lab Results: This is probably the best gift ever for a cat, but if you must get it for a human, find someone who appreciates socks that look good enough to eat. The presentation is what makes this a good gift. If they have a sense of humor, they'll love them.",
    //         product_base_price: 19.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: null,
    //         tags: "quirky",
    //         tags_sort: "quirky",
    //         tags_display: "justForFun,quirky",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81YnA4KkIgL._AC_UX679_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100135,
    //         score: 0.29543670574239417,
    //         product_name: "World Landmarks Wood Wall Art",
    //         category: "Home Decor",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1048351449/world-landmarks-wood-wall-art-world?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=travel+gift&ref=sc_gallery-1-7&pro=1&frs=1&listing_id=1048351449&listing_slug=world-landmarks-wood-wall-art-world&plkey=0c9b0eb289aeded677e7ef27f8eea2e367013665%3A1048351449",
    //         flavor_text:
    //           "Remind them of the world, even when they're stuck at home.",
    //         lab_results:
    //           "Lab Results: For the right aesthetic, we think this one looks cool. For the person who has been everywhere and wants to just remember.",
    //         product_base_price: 73.6,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "thoughtful,travel,homeDecor",
    //         tags_sort: "travel,homeDecor",
    //         tags_display: "homeDecor,thoughtful,travel",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/22669411/r/il/b6bf23/3240556693/il_fullxfull.3240556693_sm4t.jpg",
    //         listing_id: 1048351449,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100137,
    //         score: 0.29503067271054995,
    //         product_name: "Tumi - Voyageur Carson Laptop Backpack",
    //         category: "Travel",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B07DNMKN1C?th=1&linkCode=li2&tag=giftology02-20&linkId=6fc2c4cca6352ab7a68dd0b7340caa7b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07DNMKN1C&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07DNMKN1C" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3KpzIVe",
    //         flavor_text:
    //           "Those that don't want to sacrifice style for function.",
    //         lab_results:
    //           "Lab Results: The perfect combination of practicality and chic, this is the backpack for the trendy jetsetter. It's large enough for your laptop, a change of clothes, and several essentials, making it a lightweight bag that's perfect for when you're on the go.",
    //         product_base_price: 395,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "trendy,durable,travel",
    //         tags_sort: "trendy,travel",
    //         tags_display: "travel,trendy,durable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61KisQcYxNL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100042,
    //         score: 0.28991129059839377,
    //         product_name: "Stardew Valley",
    //         category: "Gaming",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Stardew-Valley-Nintendo-Switch/dp/B08F8KRRGL?keywords=stardew+valley+nintendo+switch&qid=1642629008&sprefix=stardew+valley+%2Caps%2C90&sr=8-2&linkCode=li2&tag=giftology02-20&linkId=641fb3f0187744a159487a0055ab8fcd&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08F8KRRGL&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08F8KRRGL" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zpsgDf",
    //         flavor_text:
    //           "People that think farming would be a really relaxing life, but also wish their were cute monsters to slay in a nearby dungeon.",
    //         lab_results:
    //           "Lab Results: I love this game, and although it is a great game for one player what makes it a great gift is its couch co-op mode. It's one of the best co-op experiences in years, particularly for those of you trying to get a non-gamer into gaming. My wife and I have put dozens of hours into it, and I treasured the first moment she grew independent and started developing her own bits of the farm.",
    //         product_base_price: 35.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "gaming",
    //         tags: "fun,relaxing",
    //         tags_sort: "indoors",
    //         tags_display: "gaming,fun,relaxing",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81kk1eGXZ2L._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100104,
    //         score: 0.28982040026726913,
    //         product_name: "Fezibo Standing Desk",
    //         category: "Home Office",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B08CBVCFCN?_encoding=UTF8&psc=1&linkCode=li2&tag=giftology02-20&linkId=a3fb6e14c04787efc83795fae1daff54&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08CBVCFCN&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08CBVCFCN" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3nIq7Qo",
    //         flavor_text:
    //           "For anyone dealing with back pain or just looking to be a little healthier, this is our number one pick to upgrade the work-from-home experience.",
    //         lab_results:
    //           "Lab Results: If you are looking for a high-end way to improve your work from home environment as well as your health, it's hard to beat a standing desk. I picked one up after my back started to ache from all the sitting we were doing as we transitioned to working from home. Having the motorized lift is also leagues better than the manual contraptions.",
    //         product_base_price: 269.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "efficient,organized,homeOffice",
    //         tags_sort: "efficient,organized,homeOffice",
    //         tags_display: "homeOffice,efficient,organized",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71WDQTW8piL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 9,
    //         score: 0.28926924697166034,
    //         product_name: "GoWISE USA GW22921-S 8-in-1 Digital Air Fryer",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B07JP1GFNW?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=e20490579e0268f98e8920107ef1326e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07JP1GFNW&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07JP1GFNW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3lU3KHx",
    //         flavor_text:
    //           "People who hate soggy leftovers and home cooks who want to prepare a meal quickly.",
    //         lab_results:
    //           "Lab Results: Full disclosure, I was one of those people that thought air fryers weren't worth the investment, just another object to clutter our countertops. Mid-way through the pandemic, as we relied on takeout more and more to replace our nights out, I really came around to having one of these. Don't be fooled into thinking you'll be making delicious, healthy home fries, where these devices really shine is quickly reheating leftovers back to perfect, crispy doneness, or elevating frozen ingredients from Trader Joe's. We highly recommend it.",
    //         product_base_price: 69.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "homeChef",
    //         tags: "practical",
    //         tags_sort: "practical,indoors",
    //         tags_display: "homeChef,practical",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61qfdlWpLML._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100185,
    //         score: 0.28532288961049834,
    //         product_name: "Mini Faux Plant",
    //         category: "Home Decor",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Artificial-Plastic-Plantas-Artificiales-Decorativas/dp/B09W363M3R?crid=YQDN4D1GTA07&keywords=Small+Fiddle+Leaf+Potted&qid=1664495639&sprefix=small+fiddle+leaf+potted%2Caps%2C64&sr=8-46&linkCode=li2&tag=giftology02-20&linkId=67177fa8a63e62f85dd27b19c91ac20e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09W363M3R&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09W363M3R" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3GbuMRA",
    //         flavor_text:
    //           "The sort of person who can't be trusted with a succulent.",
    //         lab_results:
    //           "Lab Results: A gift for when you really need to spruce up a room or fit something friendly on the corner of a desk. They look nice and being faux plants, you don't have to worry about wilting.\n\nReady to graduate to a live plant? We recommend a low maintenance Go full ~~ID=“100184” text=“succulent”~~.",
    //         product_base_price: 12.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "thoughtful,unexpected",
    //         tags_sort: "homeDecor",
    //         tags_display: "homeDecor,thoughtful,unexpected",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71Vqgn7W2GL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100054,
    //         score: 0.2849408163297882,
    //         product_name: "The New York Times Big Book of Mini Crosswords",
    //         category: "Board Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/1250309875?ascsubtag=%5Bartid%7C2164.g.34212065%5Bsrc%7C%5Bch%7C%5Blt%7Csale&linkCode=li2&tag=giftology02-20&linkId=62c4b636be5f6961d2d51f265a8ea95e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1250309875&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=1250309875" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3Kpv7T7",
    //         flavor_text:
    //           "The puzzler on the go, so they may never be without a crossword to solve.",
    //         lab_results:
    //           "Lab Results: This is a simple one, if you know they like crosswords this is a home run. With over 500 short form crosswords, they can spend anywhere from 5 minutes to several hours enjoying this book. Being short format, they're surprisingly addictive, making them a great travel companion and stress reliever.\n\nSpeaking of mini puzzles, check out these ~~ID=“100183” text=“tiny jigsaw puzzles”~~.",
    //         product_base_price: 15.89,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "boardGames",
    //         tags: "portable",
    //         tags_sort: "portable",
    //         tags_display: "boardGames,portable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://images-na.ssl-images-amazon.com/images/I/71afWTmwOZL.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100222,
    //         score: 0.2818773387182224,
    //         product_name: "Stackable Drawers",
    //         category: "Home Decor",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1439855367/stackable-drawerswooden-storage-box-with?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=organizer&ref=sc_gallery-1-10&frs=1&etp=1&plkey=5b13e80dbfc1c9c6e9f583fc4cc9940017be9d00%3A1439855367",
    //         flavor_text:
    //           "Workspace organizers, clutter conquerors, and those seeking order in the chaos.",
    //         lab_results:
    //           "Lab Results: Tackle desk chaos with these drawers. Stackable brilliance that corrals clutter elegantly. Transform chaos into productivity!",
    //         product_base_price: 75.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "homeDecor",
    //         tags_sort: "homeDecor",
    //         tags_display: "homeDecor",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/34375138/r/il/62779f/4860966006/il_fullxfull.4860966006_qtkx.jpg",
    //         listing_id: 1439855367,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 192,
    //         score: 0.2818773387182224,
    //         product_name: "Bamboo Art Organizer",
    //         category: "Home Decor",
    //         html_tag:
    //           '<a href="https://www.amazon.com/TEYGA-Bamboo-Craft-Organizer-Water-Paint/dp/B09X5QRML5?_encoding=UTF8&pd_rd_w=vtatA&content-id=amzn1.sym.5f7e0a27-49c0-47d3-80b2-fd9271d863ca%3Aamzn1.symc.e5c80209-769f-4ade-a325-2eaec14b8e0e&pf_rd_p=5f7e0a27-49c0-47d3-80b2-fd9271d863ca&pf_rd_r=M39YZ1F9A6CPGXBRR4CP&pd_rd_wg=YWb3o&pd_rd_r=4aa3cfa2-208e-4459-b9a0-57ab1922fc91&linkCode=li3&tag=giftology02-20&linkId=0538d77a3b0eb5139775b9bc25befaf5&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09X5QRML5&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B09X5QRML5" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3KMifGC",
    //         flavor_text:
    //           "Artists, creators, and those who desire a harmonious haven for their artistic tools.",
    //         lab_results:
    //           "Lab Results: Elevate your creative space with this bamboo organizer. A sanctuary for brushes, pens, and inspiration. Craft with tranquility!",
    //         product_base_price: 59.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "homeDecor",
    //         tags_sort: "homeDecor",
    //         tags_display: "homeDecor",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71beXzeM+zL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100065,
    //         score: 0.2772893858779614,
    //         product_name: "Jeasona Women's Fun Socks",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Pairs-Womens-Animals-Novelty-Cotton/dp/B075P7R3VN?crid=29I1DPT54N2FY&keywords=jeasona+women%27s+fun+socks&qid=1680365610&sprefix=jeasona+women%27s+fun+socks%2Caps%2C102&sr=8-5&linkCode=li2&tag=giftology02-20&linkId=b04aaff9f9875b9069b03250209696b7&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B075P7R3VN&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B075P7R3VN" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40zN07d",
    //         flavor_text:
    //           "Do they have feet? Do they like cute cats? Do they have these socks? You see where we're going with this?",
    //         lab_results:
    //           "Lab Results: We think there is too much of a stigma about giving socks as gifts. The trick is to know your audience. These things are cute, ask yourself if they'd appreciate that and gift away.",
    //         product_base_price: 18.99,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "cats",
    //         tags: "quirky",
    //         tags_sort: "quirky",
    //         tags_display: "justForFun,quirky",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/91uF1A3calL._AC_UX679_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100254,
    //         score: 0.2729442927044345,
    //         product_name: "Custom Birthstone Bracelet",
    //         category: "Just For Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/779017527/custom-birthstone-bracelet-initial?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=gifts+for+teenage+girls&ref=sr_gallery-1-12&pro=1&frs=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Personalized gift givers, sentimental souls, and those who cherish the beauty of birthstones.",
    //         lab_results:
    //           "Lab Results: Craft a unique accessory with this custom bracelet. Choose birthstones to reflect special moments, creating a wearable keepsake that tells a story. Adorn with memories!",
    //         product_base_price: 35,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "quirky,trendy",
    //         tags_sort: "quirky,trendy",
    //         tags_display: "quirky,trendy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/18017285/r/il/5edf47/2238527557/il_fullxfull.2238527557_8b0n.jpg",
    //         listing_id: 779017527,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100046,
    //         score: 0.26988907756517433,
    //         product_name: "Nintendo Switch with Neon Blue and Neon Red Joy‑Con",
    //         category: "Gaming",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B07VGRJDFY?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=c42fd021b2a6a81d897769da5c4752b3&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07VGRJDFY&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07VGRJDFY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40BGm0o",
    //         flavor_text:
    //           "Old Nintendo fans that want to introduce gaming to New Nintendo fans.",
    //         lab_results:
    //           "Lab Results: You know who's having a hard time finding a PS5? Not you, because you're looking for a Nintendo Switch, which has been out for long enough that you can pick them up just about anywhere games are sold. The catalogue for this system has been stellar, boasting everything from relaxing titles like ~~ID=“100042” text=“Stardew Valley”~~. to tough games like ~~ID=“100148” text=“Hades”~~.",
    //         product_base_price: 296,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "gaming",
    //         tags: "essential",
    //         tags_sort: "indoors",
    //         tags_display: "gaming,essential",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61-PblYntsL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100179,
    //         score: 0.2637146824076978,
    //         product_name: "Caswell-Massey Soap",
    //         category: "Bath and Body",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B09H8K6VNZ?ots=1&slotNum=65&imprToken=aac1a6cf-b44a-4ef5-ab9&ascsubtag=%5B%5Dst%5Bp%5Dcjamukaca0034o8y6zxtatgdz%5Bi%5DcmESlk%5Bu%5D2%5Bt%5Dw%5Br%5Dgoogle.com%5Bd%5DD%5Bz%5Dm&linkCode=li2&tag=giftology02-20&linkId=9f48f1b46beb91625e56456f8204bf09&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B09H8K6VNZ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B09H8K6VNZ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3U0Q6ic",
    //         flavor_text: "Someone looking for that vintage feel.",
    //         lab_results:
    //           "Lab Results: When you're giving someone soap as a gift you must make sure you know your angle. These have a rich creamy feel, heavenly scent, and a fancy design sure to please. They even come in a box that has an old-school look that elevate the whole ensemble.",
    //         product_base_price: 11,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "eco-friendly,bathAndBody",
    //         tags_sort: "bathAndBody",
    //         tags_display: "bathAndBody",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51RxpzqDfAL._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100114,
    //         score: 0.26100627091633377,
    //         product_name: "Vitruvi Diffuser",
    //         category: "Home Decor",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Cordless-diffuser-ultasonic-essential-aromatherapy/dp/B094LZR9V1?th=1&psc=1&linkCode=li2&tag=giftology02-20&linkId=17a48d51129deb5fab8de68f1d364f59&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B094LZR9V1&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B094LZR9V1" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zq2tLk",
    //         flavor_text: "People with noses who need to relax.",
    //         lab_results:
    //           "Lab Results: Attractive and easy to use, this diffuser adds just a whiff of pleasant aroma to whatever room it is in.",
    //         product_base_price: 182,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "",
    //         tags: "cozy,homeDecor",
    //         tags_sort: "homeDecor",
    //         tags_display: "homeDecor,cozy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/21o0lxwnQIS._AC_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100246,
    //         score: 0.2496905485477308,
    //         product_name: "Could Have Been an Email T-Shirt",
    //         category: "Home Office",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1347363316/funny-home-office-shirt-work-from-home?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=home+office&ref=sc_gallery-1-5&pro=1&sts=1&plkey=e0a1f48df6ac3a4d94883eab589b1e0db0008b6b%3A1347363316",
    //         flavor_text:
    //           "Office humor aficionados, efficiency advocates, and those who appreciate a good laugh at meetings.",
    //         lab_results:
    //           "Lab Results: Wear your email efficiency with pride in this tee. A humorous nod to the meetings that could've been spared. Elevate office humor!",
    //         product_base_price: 15.4,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "homeOffice",
    //         tags_sort: "homeOffice",
    //         tags_display: "homeOffice,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/34717527/r/il/bf1f14/4404402408/il_fullxfull.4404402408_bujp.jpg",
    //         listing_id: 1347363316,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100153,
    //         score: 0.2462285329280318,
    //         product_name: "Solo Stove Titan",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Solo-Stove-Titan-Lightweight-Backpacking/dp/B00DBYT9BI?crid=1IRYR6BO4UM4D&keywords=solo+stove&qid=1646141892&s=sporting-goods&sprefix=solo+stov%2Csporting%2C125&sr=1-7&linkCode=li2&tag=giftology02-20&linkId=5262b90da03bdc641c32b45b1304b936&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00DBYT9BI&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00DBYT9BI" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3M9qptX",
    //         flavor_text: "The people that want a bonfire anywhere, anytime.",
    //         lab_results:
    //           "Lab Results: A mini bonfire pit has a million applications. Camping trip and you don't want to bring fuel? Check. Backyard too small for a full-sized pit? Check. My favorite part of this thing is scavenging for twigs so you can really get it going from scratch.",
    //         product_base_price: 109.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "camping",
    //         tags: "practical,cozy",
    //         tags_sort: "practical,outdoors",
    //         tags_display: "camping,practical,cozy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/51pu3EVSyNL._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 5,
    //         score: 0.24509921762797732,
    //         product_name: "Jetboil Flash Camping Stove",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/gp/product/B0753NBMJ5?ie=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=7bd622dfdc211ba6c696730fadb5afb3&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0753NBMJ5&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0753NBMJ5" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3M9btMl",
    //         flavor_text:
    //           "Hikers that still need that morning cup of coffee, like, immediately.",
    //         lab_results:
    //           "Lab Results: This thing is awesome, fun to use, and in our testing really can boil water in less than two minutes flat. Most days on our camping trips the first thing we did is fire this puppy up and treat ourselves to some instant coffee. It's the sort of item that at least one person in the group should toss into their pack, the extra 13oz is worth it.",
    //         product_base_price: 99.95,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "camping",
    //         tags: "practical,upgrade",
    //         tags_sort: "practical,outdoors",
    //         tags_display: "camping,practical,upgrade",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81vWEk9VqLL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 5009,
    //         score: 0.24202780274799168,
    //         product_name: "Demo",
    //         category: null,
    //         html_tag: "http://placekitten.com/g/200/300",
    //         link: "www.amazon.com",
    //         flavor_text: "fun stuff",
    //         lab_results: "Lab Results here",
    //         product_base_price: 69,
    //         gender: "Male",
    //         who_ind: "Coworker",
    //         age_min: 1,
    //         age_max: 100,
    //         occasion: null,
    //         gift_type: null,
    //         hobbies_interests: null,
    //         tags: null,
    //         tags_sort: null,
    //         tags_display: null,
    //         product_card_banner: "AI Generated",
    //         direct_image_src: "http://placekitten.com/g/200/300",
    //         listing_id: 0,
    //         review_link: null,
    //         website: "ChatGPT",
    //         discount_codes: null,
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100072,
    //         score: 0.23944663908626493,
    //         product_name: "Teamoy Dog Travel Backpack",
    //         category: "Dogs",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Teamoy-Backpack-Supplies-Collapsible-Water-Resistant/dp/B07YG4F6VW?dchild=1&keywords=teamoy%2Bdog&qid=1612738153&sr=8-8&th=1&linkCode=li2&tag=giftology02-20&linkId=49bb643aa1b57170454fcd0e4e83082e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07YG4F6VW&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07YG4F6VW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3lWnY3j",
    //         flavor_text: "For the dog that's going places.",
    //         lab_results:
    //           "Lab Results: Once you have a couple of good size dogs in your life, carrying their stuff around does become a real concern. It can help to have a dedicated bag for when you know you're prepping for a picnic or a day at the beach.",
    //         product_base_price: 48.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "portable,dogs",
    //         tags_sort: "dogs,travel",
    //         tags_display: "dogs,travel,portable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81l8r9GzcbL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100134,
    //         score: 0.23533162919923825,
    //         product_name: "Travel Challenges Game",
    //         category: "Travel",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/755498299/wanderlust-travel-gift-adventure-time?click_key=a8e57f1413504c0380f3063c8e3c35e0ec94e12d%3A755498299&click_sum=db4b74da&ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=travel&ref=sr_gallery-1-4&organic_search_click=1&frs=1&pop=1",
    //         flavor_text:
    //           "Add some flare to your next holiday with this cool challenge game.",
    //         lab_results:
    //           "Lab Results: Love to travel, but unsure what to do once you get there? This little deck of cards solves that problem. Bring it every time you leave the country.",
    //         product_base_price: 23.71,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "",
    //         tags: "fun,portable,travel",
    //         tags_sort: "travel",
    //         tags_display: "travel,fun,portable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/21689190/r/il/4ce63d/3261109791/il_fullxfull.3261109791_pnv5.jpg",
    //         listing_id: 755498299,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100147,
    //         score: 0.2349431917111563,
    //         product_name: "Catit Senses 2.0 Flower Fountain",
    //         category: "Cats",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Catit-Flower-Fountain-Triple-Action-Filter/dp/B0146QXOB0?th=1&linkCode=li2&tag=giftology02-20&linkId=0fb6a6921e40d8f713e2d49f4ace26aa&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0146QXOB0&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0146QXOB0" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42WnhHT",
    //         flavor_text:
    //           "For the fussy cat that just won't drink out of a bowl.",
    //         lab_results:
    //           "Lab Results: Cat's don't like still, standing water. This little device keeps thing moving so you can keep your roommate hydrated.",
    //         product_base_price: 29.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "essential,fun,cats",
    //         tags_sort: "cats",
    //         tags_display: "cats,essential,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71WC9W9Kg6L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100091,
    //         score: 0.23181114819247262,
    //         product_name: "Erin Condren Designer Sticker Book",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B07RF4DGFD?_encoding=UTF8&th=1&linkCode=li2&tag=giftology02-20&linkId=b4cc72aa08be6f9e7b04707487d56916&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07RF4DGFD&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07RF4DGFD" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zpsE4Y",
    //         flavor_text:
    //           "For the planner that likes to decorate their planner.",
    //         lab_results:
    //           "Lab Results: This is a gift where you have to really know the recipient. Are they always taking notes or scheduling in their planner? Do they use colored pencils or highlighters to organize their day? There's a good chance they will light up when you give them this sticker book.",
    //         product_base_price: 11.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 5,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "",
    //         tags: "artsy,organized",
    //         tags_sort: "artsy,organized,indoors",
    //         tags_display: "justForFun,artsy,organized",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/614gV8BT8PL._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100110,
    //         score: 0.22918170630183476,
    //         product_name: "Perfect Fitness Pull Up Bar",
    //         category: "Health And Wellness",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Perfect-Fitness-Multi-Gym-Doorway-Portable/dp/B01KN17NTQ?asc_contentid=amzn1.osa.c57a6029-ba0d-4ebd-af9d-143889c1c59b.ATVPDKIKX0DER.en_US&asc_contenttype=article&ascsubtag=amzn1.osa.c57a6029-ba0d-4ebd-af9d-143889c1c59b.ATVPDKIKX0DER.en_US&crid=3Q0RPM6QXQETB&cv_ct_cx=pull%2Bup%2Bbar&cv_ct_id=amzn1.osa.c57a6029-ba0d-4ebd-af9d-143889c1c59b.ATVPDKIKX0DER.en_US&cv_ct_pg=search&cv_ct_we=asin&cv_ct_wn=osp-single-source-earns-comm&keywords=pull%2Bup%2Bbar&pd_rd_i=B01KN17NTQ&pd_rd_r=248874eb-4a34-438e-9736-2392e9a65b24&pd_rd_w=W1rIi&pd_rd_wg=sWbIK&pf_rd_p=5846ecd6-3f37-4a28-8efc-9c817c03dbe9&pf_rd_r=5J19NG7YKNXJP73H9K12&qid=1643405491&sprefix=pull%2Bup%2Bbar%2Caps%2C93&sr=1-1-64f3a41a-73ca-403a-923c-8152c45485fe&th=1&linkCode=li2&tag=giftology02-20&linkId=bce857c49baa816c0eb69ece889dbb20&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01KN17NTQ&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01KN17NTQ" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3nBvWze",
    //         flavor_text:
    //           "Looking to take the home gym to the next level? When's the last time you belted out some pull ups?",
    //         lab_results:
    //           "Lab Results: Pull ups are legitimately my favorite way to work out. Challenge yourself to 100 pull ups in a single day. Seriously, don't try to build up to it, don't stop because you think it's impossible, commit to 100 even if you are doing sets of 1 by the end of the day. Do that once a week and you'll be doing sets of 10 in no time and feeling like a gymnast.",
    //         product_base_price: 44.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "athletic,healthNut",
    //         tags_sort: "athletic",
    //         tags_display: "healthAndWellness,athletic,healthNut",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71EzizrzGYL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100146,
    //         score: 0.22643414861522404,
    //         product_name: "CatastrophiCreations Fabric Lift Hammock",
    //         category: "Cats",
    //         html_tag:
    //           '<a href="https://www.amazon.com/CatastrophiCreations-Raceway-Hammock-Wall-Mounted-Shelving/dp/B07J9PH6VW?th=1&linkCode=li2&tag=giftology02-20&linkId=3a4f24f4ac1a9efa5a7043250f34708f&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07J9PH6VW&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07J9PH6VW" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/4307lEi",
    //         flavor_text:
    //           "The only ones that will be more satisfied with these fashionable hammocks will be your cats.",
    //         lab_results:
    //           "Lab Results: You like to chill out, your cats like to chill out. Give them a dedicated hammock to perch in and observe their domain.",
    //         product_base_price: 56.87,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "cozy,fun,cats",
    //         tags_sort: "cats",
    //         tags_display: "cats,cozy,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/31CT3su-CFS._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100082,
    //         score: 0.22544265698179503,
    //         product_name: "Dog Mom Socks",
    //         category: "Dogs",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/752451543/dog-mom-gift-pet-owner-gift-dog-owner?utm_custom1=thepioneerwoman.com&source=aw&utm_source=affiliate_window&utm_medium=affiliate&utm_campaign=us_location_buyer&utm_content=78888&awc=6220_1636919427_e32c9ef2a39a8408bfae7466e7979d3e&utm_term=0",
    //         flavor_text:
    //           "For the woman in your life that knows the value of a quiet night in with their dog.",
    //         lab_results:
    //           "Lab Results: Good for a White Elephant when you know they're sending the right vibe.",
    //         product_base_price: 12,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "thoughtful",
    //         hobbies_interests: "",
    //         tags: "whiteElephant,cozy,dogs",
    //         tags_sort: "dogs",
    //         tags_display: "dogs,whiteElephant,cozy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/15532253/r/il/e3fa39/2081000754/il_fullxfull.2081000754_csoq.jpg",
    //         listing_id: 752451543,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100136,
    //         score: 0.22352180005689318,
    //         product_name: "Kikkerland, Bear Travel Pillow",
    //         category: "Travel",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Flip-Bear-Head-Rest-Brown/dp/B06WLJ25Q5?crid=3D2DNDXI0JGO6&keywords=kikkerland%2C+pillow&qid=1644009218&sprefix=kikkerland%2C+pillow%2Caps%2C101&sr=8-3&linkCode=li2&tag=giftology02-20&linkId=db075ab8321fa4bfdd7f1c6adf08c7f9&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B06WLJ25Q5&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B06WLJ25Q5" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3Zvdk13",
    //         flavor_text:
    //           "For the plane sleepers, this little bear is a great companion.",
    //         lab_results:
    //           "Lab Results: This is a great gift for folks that love to travel and can sleep just about anywhere. It's genuinely cute, and genuinely comfortable.",
    //         product_base_price: 37.5,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "",
    //         tags: "cozy,fun,travel",
    //         tags_sort: "travel",
    //         tags_display: "travel,cozy,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/517DRFyIJvL._AC_SL1200_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100171,
    //         score: 0.222820449961087,
    //         product_name: "Bean Box Gourmet Coffee Sampler",
    //         category: "Sampler Kits",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Bean-Box-Gourmet-Coffee-Sampler/dp/B07FMF4RCY?th=1&linkCode=li2&tag=giftology02-20&linkId=511305902d973c98961b5008d819997c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07FMF4RCY&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07FMF4RCY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/42VBhl9",
    //         flavor_text:
    //           "If their preferred method of enjoying a cup of coffee involves a French press or a Chemex, and the spirit of adventure.",
    //         lab_results:
    //           "Lab Results: Before we get into the specifics, we should point out that Sampler Kits are some of the most popular items on the site, and for good reason. They are the perfect way to mix a thoughtful gift with a touch of excitement, and at relatively low-price points punch well above their weight.\n\nThe folks at Bean Box source exclusively small-batch coffee, so the recipient is unlikely to have had anything like this before. If they like coffee more than just someone looking for their early morning fix of caffeine this offers a great first step toward enjoying specialty coffees.",
    //         product_base_price: 28.99,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "coffee,fun",
    //         tags_sort: "coffee,delicious",
    //         tags_display: "samplerkits,coffee,delicious",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/81Dc-72ldkS._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "N",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 216,
    //         score: 0.21998866255068467,
    //         product_name: "Happy Camper T-Shirt",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/T-Shirt-Mountain-Adventure-Workout-Athletic/dp/B0B38S465K?crid=SFTJ174PHRGZ&keywords=t-shirt%2C+coffee&qid=1692463217&sprefix=t-shirt%2C+coffe%2Caps%2C130&sr=8-21-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9tdGY&psc=1&linkCode=li3&tag=giftology02-20&linkId=9435c42a287f684eabcc20d05cdab790&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0B38S465K&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B0B38S465K" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3QLqpCQ",
    //         flavor_text:
    //           "Nature enthusiasts, campfire story lovers, and those who find joy in the great outdoors.",
    //         lab_results:
    //           'Lab Results: Declare your love for outdoor adventures with this tee. Embrace the spirit of a "Happy Camper" and wear your nature-loving heart on your sleeve. Explore with a smile!',
    //         product_base_price: 11.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "camping",
    //         tags_sort: "camping",
    //         tags_display: "camping",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71fyu3M8qiL._AC_UX679_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100094,
    //         score: 0.21306470348298107,
    //         product_name: "Stellaire Chern Snuffle Mat",
    //         category: "Dogs",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B07MFJB749?th=1&linkCode=li2&tag=giftology02-20&linkId=7d096cd9f33c65bf1edcff71bcafb6d8&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07MFJB749&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07MFJB749" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3lR9bqI",
    //         flavor_text:
    //           "The dog that needs to earn his treat, and the human who wants to keep them occupied for five minutes.",
    //         lab_results:
    //           "Lab Results: A snuffle mat is essentially a sheet with a bunch of felt attachments that create the perfect hiding place to store treats. Have your pet wait patiently while the excitement builds and then let 'em rip.",
    //         product_base_price: 31.98,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "fun,dogs",
    //         tags_sort: "dogs",
    //         tags_display: "dogs,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61644P2tq+L._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100098,
    //         score: 0.21045537578566403,
    //         product_name: "TeeTurtle Reversible Octopus Plushie",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B07H48YNJ2?th=1&linkCode=li2&tag=giftology02-20&linkId=a3cd2aa810e2b13dd38cefaf9eeb128e&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07H48YNJ2&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07H48YNJ2" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zp9KuM",
    //         flavor_text:
    //           "Like a mood ring mash-up with a Beenie Baby, these cute little toys are blowing up.",
    //         lab_results:
    //           "Lab Results: These little plushies are adorable bean bags in the best way possible. Cute to be sure, fun to play with, and surprisingly stress relieving. They make great stocking stuffers or Secret Santa gifts, just be sure to get one for yourself. ",
    //         product_base_price: 15,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 10,
    //         age_max: 40,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "",
    //         tags: "quirky",
    //         tags_sort: "quirky",
    //         tags_display: "justForFun,quirky,deskToy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/41WQsO+I1uL._AC_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100187,
    //         score: 0.20861269544033098,
    //         product_name: "Godiva Truffle Flight",
    //         category: "Sampler Kits",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Godiva-Chocolatier-Patisserie-Assorted-Chocolate/dp/B08NRN7DG3?crid=2S71NOIO6HXCI&keywords=godiva+sampler&qid=1664745304&qu=eyJxc2MiOiIzLjMyIiwicXNhIjoiMy4wMSIsInFzcCI6IjIuMDAifQ%3D%3D&sprefix=godiva+sampler%2Caps%2C97&sr=8-11&linkCode=li2&tag=giftology02-20&linkId=81f6bc130e9de78d109b8054bbec2463&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08NRN7DG3&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08NRN7DG3" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3GaP0dY",
    //         flavor_text: "Everyone likes chocolate.",
    //         lab_results:
    //           "Lab Results: Before we get into the specifics, we should point out that Sampler Kits are some of the most popular items on the site, and for good reason. They are the perfect way to mix a thoughtful gift with a touch of excitement, and at relatively low-price points punch well above their weight.\n\nThis is an easy one, you've got a solid brand name, a beautiful little box, and legitimately delicious chocolate. This is a great anytime gift, or something perfect for coworkers around the holidays.\n\nLike the idea of a sampler pack but looking for something a little edgier? Check out this ~~ID=“100180” text=“bitters variety pack”~~.",
    //         product_base_price: 19,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "fun",
    //         tags_sort: "delicious",
    //         tags_display: "samplerkits,delicious",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/61P5XUJbu1L._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100208,
    //         score: 0.20365240141318064,
    //         product_name: "Coffee Pulse Shirt",
    //         category: "Just for Fun",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B08T657C5M?_encoding=UTF8&psc=1&linkCode=li3&tag=giftology02-20&linkId=de979835dfbb27c704e9272c6b0f378b&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08T657C5M&Format=_SL250_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li3&o=1&a=B08T657C5M" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3OKZZhE",
    //         flavor_text:
    //           "Coffee devotees, java enthusiasts, and anyone whose heart races at the mere thought of their next caffeine fix.",
    //         lab_results:
    //           "Lab Results: Declare your love for coffee loud and clear with this pulse-racing tee. It's a wearable declaration that your heart beats to the rhythm of coffee's aromatic allure. From the first sip to the last drop, this shirt captures the journey of every coffee lover's day. Wear it proudly as a badge of honor, showing the world that your heartbeat is fueled by the rich, robust elixir that keeps you alive and buzzing.",
    //         product_base_price: 11.99,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "coffee",
    //         tags_sort: "coffee",
    //         tags_display: "coffee",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71DC+yDai7L._AC_UX679_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100092,
    //         score: 0.20029239004086033,
    //         product_name: "Canada Pooch Winter Dog Coat",
    //         category: "Dogs",
    //         html_tag:
    //           '<a href="https://www.amazon.com/dp/B07JWZZDND?&linkCode=li2&tag=giftology02-20&linkId=cc9f5b9495acf5d9115ea34413cba91c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07JWZZDND&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07JWZZDND" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zmAZGz",
    //         flavor_text:
    //           "Little dogs who know that snow isn't just for Huskies.",
    //         lab_results:
    //           "Lab Results: We tried a variety of coats on our 6lb Yorkie and this ended up being our favorite. It's heavy enough to keep your little guy's chills away.",
    //         product_base_price: 66.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials",
    //         hobbies_interests: "",
    //         tags: "cozy,dogs",
    //         tags_sort: "dogs",
    //         tags_display: "dogs,cozy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/41M-MKipnOL._AC_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100061,
    //         score: 0.19708538258430472,
    //         product_name: "Queen Majesty Hot Sauce Trinity Sampler",
    //         category: "Home Chef",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Queen-Majesty-Hot-Sauce-Trinity/dp/B075QPBX3B?keywords=queen+majesty+hot+sauce&qid=1636922928&sr=8-1-spons&psc=1&smid=A1VAOWZNDCV6C6&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyUEk5TjhOUlRBV1A4JmVuY3J5cHRlZElkPUEwMTAxMzU4MzhTOFIzWEtBRFRBQyZlbmNyeXB0ZWRBZElkPUEwMDk4NjE2M0kxQU1JUElGR05WNiZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU%3D&linkCode=li2&tag=giftology02-20&linkId=84b791d909773f7bb956b33ace3d1223&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B075QPBX3B&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B075QPBX3B" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/439q4O6",
    //         flavor_text:
    //           "This is a fun one for the more daring taco enthusiast.",
    //         lab_results:
    //           "Lab Results: Sampler packs make great gifts by bring an extra element of surprise and fun to the table. The Queen Majesty hot sauce set showcases a variety of flavors in addition to varying levels of heat. If their palette leans spicy, there's a good chance they'll have a great time with this gift.\n\nLike the idea of a sampler pack but unsure if hot sauce is the right move? Check out ~~ID=“100173” text=“Gusto's Original Barbecue Rubs”~~.",
    //         product_base_price: 19.95,
    //         gender: null,
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "homeChef",
    //         tags: "spicy",
    //         tags_sort: "",
    //         tags_display: "homeChef,spicy",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71B0qmwWdfL._SL1280_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100126,
    //         score: 0.18449423830368136,
    //         product_name: "Push Pin World Map Board",
    //         category: "Travel",
    //         html_tag:
    //           '<a href="https://www.amazon.com/World-Travel-Map-Pin-Board/dp/B01DI2XZEY?crid=D6R5O4NBNQRG&keywords=world+map+pin+board&qid=1644007643&sprefix=world+map+pin+board%2Caps%2C108&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFaWDJMM0VRSkVKR0MmZW5jcnlwdGVkSWQ9QTA3OTAyOTgxMUk0OUY5NUkySFZJJmVuY3J5cHRlZEFkSWQ9QTA5NzkxNjMxUFpTMzRWMFRaTkdUJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ%3D%3D&linkCode=li2&tag=giftology02-20&linkId=cb81da1921b25e454d37b797221b1ccc&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01DI2XZEY&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01DI2XZEY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40NgXjY",
    //         flavor_text:
    //           "New couples that have just started seeing the world together.",
    //         lab_results:
    //           "Lab Results: There's something about this item that gets the recipient thinking about the future as well as the past, and that makes it even more thoughtful. We recommend grabbing this one right after coming home from a big trip, so you have an excuse to drop in your first pin.\n\nThe map comes with pins so you can get started immediately and is handmade in Columbus, Ohio.",
    //         product_base_price: 109,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "thoughtful,travel",
    //         tags_sort: "travel",
    //         tags_display: "travel,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71YB4v3zWnL._SL1201_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100227,
    //         score: 0.18250996240939443,
    //         product_name: "Canvas Apron",
    //         category: "Home Chef",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1118100665/personalized-full-gray-canvas-apron-with?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=chef&ref=sr_gallery-1-2&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Home chefs, DIY enthusiasts, and anyone who wants to wear their creativity in the kitchen.",
    //         lab_results:
    //           "Lab Results: Cook up style with this canvas apron. Customize it to reflect your personality. Every meal's a masterpiece, wear it proudly!",
    //         product_base_price: 37,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "homeChef",
    //         tags: "",
    //         tags_sort: "",
    //         tags_display: "",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/9525332/r/il/eef45c/3505390473/il_fullxfull.3505390473_s6qb.jpg",
    //         listing_id: 1118100665,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100076,
    //         score: 0.17132284264094721,
    //         product_name: "Great Night for a Campfire Wall Decor",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Open-Road-Brands-Campfire-Living/dp/B08W9V29XS?crid=2GTTJQ4V3WJHC&keywords=campfire%2Bart&qid=1642363200&sprefix=campfire%2Bart%2Caps%2C96&sr=8-5&th=1&linkCode=li2&tag=giftology02-20&linkId=1267d44489bffd99ff0ae8074124c12c&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B08W9V29XS&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B08W9V29XS" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/40BH3qw",
    //         flavor_text:
    //           "Nomads decorating their camper, cabin, or maybe just their den.",
    //         lab_results:
    //           "Lab Results: This looks best hanging up in someone's cabin, so get it for someone that just bought a cabin.",
    //         product_base_price: 24.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "thoughtful",
    //         hobbies_interests: "camping",
    //         tags: "thoughtful,nature",
    //         tags_sort: "",
    //         tags_display: "camping,thoughtful,nature",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71o6Lw4YDwL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100075,
    //         score: 0.17091037932555314,
    //         product_name: "D.S. & Durga Portable Fireplace Candle",
    //         category: "Camping",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Portable-Fireplace-Candle-candle-Durga/dp/B01N1ZR1S9?&linkCode=li2&tag=giftology02-20&linkId=1ed58b0df1c1d7d220dfa1e9eea37e18&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B01N1ZR1S9&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B01N1ZR1S9" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3Ka14O6",
    //         flavor_text:
    //           "If they're always running late, they should at least have a cool clock let them know.",
    //         lab_results:
    //           "Lab Results: This might feel like a high price point for a candle, but it smells stunningly like the real thing. This is a great gift for bachelor parties or office events where you know you're dealing with someone that loves the outdoors.",
    //         product_base_price: 65,
    //         gender: "male",
    //         who_ind: "coworker",
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "thoughtful",
    //         hobbies_interests: "camping",
    //         tags: "thoughtful",
    //         tags_sort: "",
    //         tags_display: "camping,thoughtful",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/418x3W3xNnL.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100057,
    //         score: 0.1646589714805563,
    //         product_name:
    //           "Cavallini Papers & Co. National Parks 1,000 Piece Puzzle",
    //         category: "Board Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Cavallini-Papers-Co-National-Puzzle/dp/1635447208?keywords=national+parks+puzzle&qid=1636922411&sr=8-6&linkCode=li2&tag=giftology02-20&linkId=2f9858d5e2257140565a04e0652a76c6&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=1635447208&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=1635447208" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3KpxKUN",
    //         flavor_text:
    //           "If you're feeling like an outdoorsy sort of puzzle to remind you what the great outdoors felt like, have we got the gift for you.",
    //         lab_results:
    //           "Lab Results: We are big fans of puzzles. The more of the National Parks your recipient has been to and will recognize, the more we recommend this gift. The build quality is high, with all of the pieces fitting snugly into their positions, and we especially like the vintage images chosen for each of the national parks.",
    //         product_base_price: 28.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "boardGames",
    //         tags: "nature",
    //         tags_sort: "",
    //         tags_display: "boardGames,nature",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/614WN8O2fWL._AC_SL1000_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100052,
    //         score: 0.1638218128416011,
    //         product_name: "Monopoly Deal",
    //         category: "Board Games",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Hasbro-B0965-Monopoly-Deal-Card/dp/B00NQQTZCO?keywords=monopoly+deal&qid=1636516052&qsid=145-7991310-5477726&sr=8-1&sres=B00NQQTZCO%2CB07H5HFTWC%2CB07MBKDPF2%2CB092541K72%2CB07L9DZ5DV%2CB07F8JBWZR%2CB08GR812RV%2CB08HJN16XC%2CB08GV4QL2V%2CB08GXCD8BN%2CB01MU9K3XU%2CB07VVLQ5LS%2CB06XYLL66Y%2CB01ALHAMTK%2CB07K968Q1C%2CB00EDBY7X8%2CB0771YL7DZ%2CB08TPD82SC%2CB08WM26LZB%2CB07TS96J7Q&srpt=TABLETOP_GAME&linkCode=li2&tag=giftology02-20&linkId=e50db4604ea27864a5b2ddfdb8786ea6&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B00NQQTZCO&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B00NQQTZCO" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3zqI5JU",
    //         flavor_text:
    //           "Fans of the original Monopoly that want to get down to business in a new format.",
    //         lab_results:
    //           "Lab Results: A faster paced version of monopoly that makes the perfect stocking stuffer, and we do mean fast. This game avoids the classic issue of the 3 hour monopoly game, with most games lasting less than 30 minutes. You can take this one with you to the local restaurant or bar and end up playing multiple rounds over the course of an evening.",
    //         product_base_price: 5.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: "whiteElephant",
    //         gift_type: "interestingAndFun",
    //         hobbies_interests: "boardGames",
    //         tags: "portable",
    //         tags_sort: "",
    //         tags_display: "boardGames,portable",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/91KOKqHaKpL._AC_SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100209,
    //         score: 0.15972493449350833,
    //         product_name: "It's a Tea Shirt",
    //         category: "Just for Fun",
    //         html_tag: "",
    //         link: "https://www.etsy.com/listing/1094076607/its-a-tea-shirt-tea-lover-shirt-tea?ga_order=most_relevant&ga_search_type=all&ga_view_type=gallery&ga_search_query=tea&ref=sr_gallery-1-2&pro=1&sts=1&organic_search_click=1",
    //         flavor_text:
    //           "Tea enthusiasts, pun aficionados, and those who appreciate a clever play on words steeped in style.",
    //         lab_results:
    //           "Lab Results: Step up your pun game and tea love with this whimsical tee. It's not just a shirt; it's a statement that blends fashion and wordplay like a perfectly brewed cup of tea. Ideal for those who find solace in a delicate tea infusion and a good laugh, this shirt makes a sippable statement.",
    //         product_base_price: 13.9,
    //         gender: "female",
    //         who_ind: null,
    //         age_min: 12,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun,thoughtful",
    //         hobbies_interests: "",
    //         tags: "tea",
    //         tags_sort: "tea",
    //         tags_display: "tea",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://i.etsystatic.com/27739437/r/il/fe5121/3703340242/il_fullxfull.3703340242_bdxv.jpg",
    //         listing_id: 1094076607,
    //         review_link: "",
    //         website: "Etsy",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100149,
    //         score: 0.1503351996952438,
    //         product_name: "Hollow Knight (Nintendo Switch)",
    //         category: "Gaming",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Hollow-Knight-Nintendo-Switch/dp/B07QHXM3JY?th=1&linkCode=li2&tag=giftology02-20&linkId=ef6b6d6701db7c3899e25aaed604a869&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B07QHXM3JY&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B07QHXM3JY" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3K0eLih",
    //         flavor_text: "The Pale King's chosen.",
    //         lab_results:
    //           "Lab Results: If they like the Metroidvania playstyle, this is the best entry to the genre in years.",
    //         product_base_price: 42.99,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "gaming",
    //         tags: "fun",
    //         tags_sort: "",
    //         tags_display: "gaming,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/71UQZy7HEjL._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //       {
    //         product_id: 100148,
    //         score: 0.1496027315134901,
    //         product_name: "Hades (PS5)",
    //         category: "Gaming",
    //         html_tag:
    //           '<a href="https://www.amazon.com/Hades-PS5-playstation-5/dp/B0978XR29N?&linkCode=li2&tag=giftology02-20&linkId=c946137edc5ae3e720c4184e7386ce21&language=en_US&ref_=as_li_ss_il" target="_blank"><img border="0" src="//ws-na.amazon-adsystem.com/widgets/q?_encoding=UTF8&ASIN=B0978XR29N&Format=_SL160_&ID=AsinImage&MarketPlace=US&ServiceVersion=20070822&WS=1&tag=giftology02-20&language=en_US" ></a><img src="https://ir-na.amazon-adsystem.com/e/ir?t=giftology02-20&language=en_US&l=li2&o=1&a=B0978XR29N" width="1" height="1" border="0" alt="" style="border:none !important; margin:0px !important;" />',
    //         link: "https://amzn.to/3nDruQA",
    //         flavor_text: "Someone who knows the Prince of the Underworld.",
    //         lab_results:
    //           "Lab Results: As of August 2021, you can purchase one of the best games of 2020 for just about any system. If they haven't check it out yet we can't recommend this dungeon crawler enough.",
    //         product_base_price: 34.98,
    //         gender: null,
    //         who_ind: null,
    //         age_min: 18,
    //         age_max: 120,
    //         occasion: null,
    //         gift_type: "essentials,interestingAndFun",
    //         hobbies_interests: "gaming",
    //         tags: "fun",
    //         tags_sort: "",
    //         tags_display: "gaming,fun",
    //         product_card_banner: "",
    //         direct_image_src:
    //           "https://m.media-amazon.com/images/I/810AgB9m8HS._SL1500_.jpg",
    //         listing_id: 0,
    //         review_link: "",
    //         website: "Amazon",
    //         discount_codes: "",
    //         is_ai_generated: false,
    //         is_added_directly: false,
    //       },
    //     ],
    //     quizData: {
    //       who: "myself",
    //       gender: "male",
    //       name: "dsfsdf",
    //       age: "12-20",
    //       occasion: "any",
    //       hobbies: ["healthAndWellness", "reading", "technology"],
    //       tags: [
    //         "competitive",
    //         "nerdy",
    //         "trendy",
    //         "homeDecor",
    //         "homeOffice",
    //         "music",
    //         "technology",
    //       ],
    //       id: "f112716c-6599-4096-b62f-f66e055f0317",
    //     },
    //   });
    // }
    if (result.length === 0) {
      return res.send({ products: [], quizData: quizData });
    }
    let noNaN = result.replace(/NaN/g, "0");
    const minAge = parseInt(quizResults.age.split("-")[0]);
    const maxAge = parseInt(quizResults.age.split("-")[1]);
    const minAgeFilter = JSON.parse(noNaN).filter(
      (product) => parseInt(product.age_min) <= maxAge
    );
    const ageFiltered = minAgeFilter.filter(
      (product) => parseInt(product.age_max) >= minAge
    );
    for (const product of ageFiltered) {
      if (product.website === "Etsy") {
        const imageURL = await getImage(product.listing_id);
        if (imageURL !== null) {
          product.direct_image_src = imageURL;
        }
      }
    }

    res.send({ products: ageFiltered, quizData: quizData });

    // if (!result || result.length === 0) {
    //   res.send({ products: [], quizData: quizData });
    // } else {
    //   let withoutTags = result[0].replace(
    //     /"html_tag":.*?"flavor_text":/g,
    //     '"flavor_text":'
    //   );
    //   try {
    //     let withoutNaN = JSON.parse(withoutTags.replace(/NaN/g, "0"));
    //     // Continue processing withoutNaN

    //     const minAge = parseInt(quizResults.age.split("-")[0]);
    //     const maxAge = parseInt(quizResults.age.split("-")[1]);
    //     const minAgeFilter = withoutNaN.filter(
    //       (product) => parseInt(product.age_min) <= maxAge
    //     );
    //     const ageFiltered = minAgeFilter.filter(
    //       (product) => parseInt(product.age_max) >= minAge
    //     );
    //     res.send({
    //       products: ageFiltered,
    //       quizData: quizData,
    //     });
    //   } catch (error) {
    //     console.error("Error parsing JSON:", error);
    //   }
    // }
  });
  pythonProcess.stdin.write(JSON.stringify(req.body));
  // pythonProcess.stdin.end(console.log("end", result));
  return;

  // const test = {
  //   age: "30-30",
  //   hobbies: ["gardening", "healthAndWellness", "reading"],
  //   occasion: "holiday",
  //   prefer: "outdoor",
  //   tags: [],
  //   type: ["thoughtful"],
  //   who: "myself",
  // };

  // const { answers: quizResults } = req.body;

  // try {
  //   //Split products if coworkers
  //   if (quizResults.who === "coworker" && quizResults.howMany != "1") {
  //     // const minPrice = parseInt(quizResults.price.split("-")[0]);
  //     // const maxPrice = parseInt(quizResults.price.split("-")[1]);
  //     const allProducts = await retriveProducts();
  //     let priceandTypeFiltered = [];

  //     // FILTER OUT AGES
  //     // const minPriceFilter = allProducts.filter(
  //     //   (product) => parseInt(product.productBasePrice) <= maxPrice
  //     // );
  //     // const priceFiltered = minPriceFilter.filter(
  //     //   (product) => parseInt(product.productBasePrice) >= minPrice
  //     // );
  // const minAge = parseInt(quizResults.age.split("-")[0]);
  // const maxAge = parseInt(quizResults.age.split("-")[1]);
  //     // This is the types we want to show
  // // FILTER OUT AGES
  // const minAgeFilter = allProducts.filter(
  //   (product) => parseInt(product.age_min) <= maxAge
  // );
  // const ageFiltered = minAgeFilter.filter(
  //   (product) => parseInt(product.age_max) >= minAge
  // );

  //     // priceandTypeFiltered = ageFiltered;

  //     calculateScoreForAll(ageFiltered, quizResults).then((result) => {
  //       // Organize results by high to low score
  //       result.sort(function (a, b) {
  //         let n = b.score - a.score;
  //         if (n !== 0) {
  //           return n;
  //         }

  //         return parseInt(a.productBasePrice) - parseInt(b.productBasePrice);
  //       });

  //       res.send({ products: result, quizData: quizData });
  //     });
  //   } else {
  //     const minAge = parseInt(quizResults.age.split("-")[0]);
  //     const maxAge = parseInt(quizResults.age.split("-")[1]);
  //     // This is the types we want to show
  //     const giftTypeArray = quizResults?.type || [];
  //     let typeAndAgeFiltered = [];
  //     retriveProducts().then((allProducts) => {
  //       // console.log('everything', allProducts);
  //       // FILTER OUT AGES
  //       const minAgeFilter = allProducts.filter(
  //         (product) => parseInt(product.age_min) <= maxAge
  //       );
  //       const ageFiltered = minAgeFilter.filter(
  //         (product) => parseInt(product.age_max) >= minAge
  //       );
  //       // FILTER OUT GIFT TYPES
  //       if (giftTypeArray.length > 0) {
  //         typeAndAgeFiltered = ageFiltered.filter((product) => {
  //           const productTypes = product.gift_type.toString().split(",");
  //           return giftTypeArray.some((r) => productTypes.includes(r));
  //         });
  //       } else {
  //         typeAndAgeFiltered = ageFiltered;
  //       }

  //       // calculate score for each product and return all in a collection
  //       calculateScoreForAll(typeAndAgeFiltered, quizResults).then((result) => {
  //         result.sort(function (a, b) {
  //           let n = b.score - a.score;
  //           if (n !== 0) {
  //             return n;
  //           }

  //           return (
  //             parseInt(a.product_base_price) - parseInt(b.product_base_price)
  //           );
  //         });

  //         res.send({ products: result, quizData: quizData });
  //       });
  //     });
  //   }
  // } catch (err) {
  //   console.log("ERROR", err);
  //   res.send(err);
  // }
});

//!!!!DEPRECATED ROUTE!!!!!!
router.post("/", async (req, res) => {
  const test = {
    age: "30-30",
    hobbies: ["gardening", "healthAndWellness", "reading"],
    occasion: "holiday",
    prefer: "outdoor",
    tags: [],
    type: ["thoughtful"],
    who: "myself",
  };

  //What to send:
  // Array of Categories with products and the average score

  const quizResults = req.body;
  try {
    if (quizResults.age) {
      const minAge = parseInt(quizResults.age.split("-")[0]);
      const maxAge = parseInt(quizResults.age.split("-")[1]);
      // This is the types we want to show
      const giftTypeArray = quizResults.type;
      let typeAndAgeFiltered = [];
      retriveProducts().then((allProducts) => {
        // FILTER OUT AGES
        const minAgeFilter = allProducts.filter(
          (product) => parseInt(product.age_min) <= maxAge
        );
        const ageFiltered = minAgeFilter.filter(
          (product) => parseInt(product.ageMax) >= minAge
        );
        // FILTER OUT GIFT TYPES
        if (giftTypeArray.length > 0) {
          typeAndAgeFiltered = ageFiltered.filter((product) => {
            const productTypes = product.giftType.toString().split(",");
            return giftTypeArray.some((r) => productTypes.includes(r));
          });
        } else {
          typeAndAgeFiltered = ageFiltered;
        }

        calculateScoreByCategory(typeAndAgeFiltered, quizResults).then(
          (result) => {
            const arrayOfCategories = groupBy(result, "category");
            const categories = Object.keys(arrayOfCategories);
            const scores = [];
            categories.forEach((category) => {
              let averageScore = 0;
              arrayOfCategories[category].forEach((product) => {
                averageScore += product.score;
              });

              averageScore = round10(
                averageScore / arrayOfCategories[category].length,
                -1
              );

              scores.push({ name: category, score: averageScore });
            });
            res.send({ categoryScores: scores, products: result });
          }
        );
      });
    }
    //Split products if coworkers
    if (quizResults.who === "coworker" && quizResults.howMany != "1") {
      const minPrice = parseInt(quizResults.price.split("-")[0]);
      const maxPrice = parseInt(quizResults.price.split("-")[1]);

      let priceandTypeFiltered = [];
      retriveProducts().then((allProducts) => {
        // FILTER OUT AGES
        const minPriceFilter = allProducts.filter(
          (product) => parseInt(product.productBasePrice) <= maxPrice
        );
        const priceFiltered = minPriceFilter.filter(
          (product) => parseInt(product.productBasePrice) >= minPrice
        );

        priceandTypeFiltered = priceFiltered;

        calculateScoreByCategory(priceandTypeFiltered, quizResults).then(
          (result) => {
            const arrayOfCategories = groupBy(result, "category");
            const categories = Object.keys(arrayOfCategories);
            const scores = [];
            categories.forEach((category) => {
              let averageScore = 0;
              arrayOfCategories[category].forEach((product) => {
                averageScore += product.score;
              });

              averageScore = round10(
                averageScore / arrayOfCategories[category].length,
                -1
              );

              scores.push({ name: category, score: averageScore });
            });
            res.send({ categoryScores: scores, products: result });
          }
        );
      });
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/etsyImages", async (req, res) => {
  const listingId = req.query.listingId;
  console.log("checking etsy", listingId);
  const imageURL = await getImage(listingId);

  res.send(imageURL || null);
});

module.exports = router;
