const express = require("express");
const getImage = require("../api/getEtsy");
const { v4 } = require("uuid");
const router = express.Router();

const pool = require("../dataBaseSQL/db");

const updateUser = async (email, answers) => {
  const client = await pool.connect();
  try {
    const foundUserQuery = "SELECT * FROM users WHERE email = $1";
    const foundUserResult = await client.query(foundUserQuery, [email]);
    const foundUser = foundUserResult.rows[0];
    if (foundUser) {
      const quizId = v4();
      const newQuizData = {
        id: quizId,
        quizResults: answers,
        wishlist: [],
      };
      if (foundUser.user_data) {
        let userData = JSON.parse(foundUser.user_data);
        let oldWishList = [];

        for (let i = 0; i < userData.length; i++) {
          if (userData[i].quizResults.name === answers.name) {
            oldWishList = userData[i].wishlist;
            userData.splice(i, 1);
          }
        }

        newQuizData.wishlist = oldWishList;
        userData.push(newQuizData);

        const updateUserQuery =
          "UPDATE users SET user_data = $1 WHERE email = $2";
        await client.query(updateUserQuery, [JSON.stringify(userData), email]);
      } else {
        const updateUserQuery =
          "UPDATE users SET user_data = $1 WHERE email = $2";
        await client.query(updateUserQuery, [
          JSON.stringify([newQuizData]),
          email,
        ]);
      }
      return newQuizData;
    } else {
      console.log("User not found.");
    }
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
    const query = "SELECT * FROM products";
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
    const tagArray = product.tags_sort.split(",");
    const lowerCase = hArray.split(",").map((array) => array.toLowerCase());
    const lowerCaseTagArray = tagArray.map((array) => array.toLowerCase());
    const lowerCaseOc = Array.isArray(oArray)
      ? oArray.map((array) => array.toLowerCase())
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

router.post("/allProducts", async (req, res) => {
  let quizData;
  if (req.body.email) {
    quizData = await updateUser(req.body.email, req.body.answers);
  }

  const test = {
    age: "30-30",
    hobbies: ["gardening", "healthAndWellness", "reading"],
    occasion: "holiday",
    prefer: "outdoor",
    tags: [],
    type: ["thoughtful"],
    who: "myself",
  };

  const { answers: quizResults } = req.body;

  try {
    //Split products if coworkers
    if (quizResults.who === "coworker" && quizResults.howMany != "1") {
      // const minPrice = parseInt(quizResults.price.split("-")[0]);
      // const maxPrice = parseInt(quizResults.price.split("-")[1]);
      const allProducts = await retriveProducts();
      let priceandTypeFiltered = [];

      // FILTER OUT AGES
      // const minPriceFilter = allProducts.filter(
      //   (product) => parseInt(product.productBasePrice) <= maxPrice
      // );
      // const priceFiltered = minPriceFilter.filter(
      //   (product) => parseInt(product.productBasePrice) >= minPrice
      // );
      const minAge = parseInt(quizResults.age.split("-")[0]);
      const maxAge = parseInt(quizResults.age.split("-")[1]);
      // This is the types we want to show
      // FILTER OUT AGES
      const minAgeFilter = allProducts.filter(
        (product) => parseInt(product.age_min) <= maxAge
      );
      const ageFiltered = minAgeFilter.filter(
        (product) => parseInt(product.age_max) >= minAge
      );

      // priceandTypeFiltered = ageFiltered;

      calculateScoreForAll(ageFiltered, quizResults).then((result) => {
        // Organize results by high to low score
        result.sort(function (a, b) {
          let n = b.score - a.score;
          if (n !== 0) {
            return n;
          }

          return parseInt(a.productBasePrice) - parseInt(b.productBasePrice);
        });

        res.send({ products: result, quizData: quizData });
      });
    } else {
      const minAge = parseInt(quizResults.age.split("-")[0]);
      const maxAge = parseInt(quizResults.age.split("-")[1]);
      // This is the types we want to show
      const giftTypeArray = quizResults?.type || [];
      let typeAndAgeFiltered = [];
      retriveProducts().then((allProducts) => {
        // console.log('everything', allProducts);
        // FILTER OUT AGES
        const minAgeFilter = allProducts.filter(
          (product) => parseInt(product.age_min) <= maxAge
        );
        const ageFiltered = minAgeFilter.filter(
          (product) => parseInt(product.age_max) >= minAge
        );
        // FILTER OUT GIFT TYPES
        if (giftTypeArray.length > 0) {
          typeAndAgeFiltered = ageFiltered.filter((product) => {
            const productTypes = product.gift_type.toString().split(",");
            return giftTypeArray.some((r) => productTypes.includes(r));
          });
        } else {
          typeAndAgeFiltered = ageFiltered;
        }

        // calculate score for each product and return all in a collection
        calculateScoreForAll(typeAndAgeFiltered, quizResults).then((result) => {
          result.sort(function (a, b) {
            let n = b.score - a.score;
            if (n !== 0) {
              return n;
            }

            return (
              parseInt(a.product_base_price) - parseInt(b.product_base_price)
            );
          });

          res.send({ products: result, quizData: quizData });
        });
      });
    }
  } catch (err) {
    console.log("ERROR", err);
    res.send(err);
  }
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
