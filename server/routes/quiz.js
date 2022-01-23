const express = require('express');
// const { requireAuth } = require('./middleware');
const { Product } = require('../database/schemas');
const getImage = require('../api/getEtsy');

function decimalAdjust(type, value, exp) {
  // If the exp is undefined or zero...
  if (typeof exp === 'undefined' || +exp === 0) {
    return Math[type](value);
  }
  value = +value;
  exp = +exp;
  // If the value is not a number or the exp is not an integer...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
    return NaN;
  }
  // Shift
  value = value.toString().split('e');
  value = Math[type](+(value[0] + 'e' + (value[1] ? +value[1] - exp : -exp)));
  // Shift back
  value = value.toString().split('e');
  return +(value[0] + 'e' + (value[1] ? +value[1] + exp : exp));
}

const round10 = (value, exp) => decimalAdjust('round', value, exp);

const router = express.Router();

module.exports = router;

async function retriveProducts() {
  const allProducts = await Product.find({});

  return await allProducts;
}

//TODO: Do all of the scoring in one function
// Average the scores after all individual products have been scored

//turn this into a get function that works
//To test, get this activated on a route
// The logic being if the  website is Etsy- run it through the etst fetcher and add it as a property of the products

async function calculateScore(ageFiltered, quizResults) {
  const minPrice = parseInt(quizResults.price.split('-')[0]);
  const maxPrice = parseInt(quizResults.price.split('-')[1]);
  const filteredArray = ageFiltered;
  for (const product of filteredArray) {
    // filteredArray.forEach(async function (product) {
    // FETCH ETSY IMAGE IF NEEDED
    if (product.website == 'Etsy') {
      console.log('ETSY HERE');
      const imageURL = await getImage(product.listingId);
      product.directImageSrc = imageURL;
    }

    let score = 0;
    if (product.indoorOutdoor == quizResults.prefer) {
      // console.log('matching indoor', product.productName);
      score++;
    }
    const hArray = product.hobbiesInterests.toString().split(',');
    const tagArray = product.tags.toString().split(',');
    const lowerCase = hArray.map((array) => array.toLowerCase());
    const lowerCaseTagArray = tagArray.map((array) => array.toLowerCase());

    // SCORING HOBBIES
    quizResults.hobbies.forEach((hobby) => {
      if (lowerCase.includes(hobby.toLowerCase())) {
        // console.log('product name', product.productName);
        // console.log('matching hobby', product.productName);

        score = score + 5;
      }
    });
    // SCORING TAGS

    quizResults.tags.forEach((tag) => {
      if (lowerCaseTagArray.includes(tag.toLowerCase())) {
        score++;
      }
    });
    if (
      product.productBasePrice >= minPrice &&
      product.productBasePrice <= maxPrice
    ) {
      // console.log('matching price', product.productName);

      score++;
    }
    product.score = score;
    // console.log('product Price', product.score);
    // console.log('product name', product.productName);
  }
  console.log('THE END', filteredArray);
  return filteredArray;
}

function groupBy(arr, property) {
  return arr.reduce((memo, x) => {
    if (!memo[x[property]]) {
      memo[x[property]] = [];
    }
    memo[x[property]].push(x);
    return memo;
  }, {});
}

// full path is api/quiz
router.post('/', async (req, res) => {
  const test = {
    who: 'relative',
    prefer: 'indoor',
    age: '5-6',
    occassion: 'birthday',
    type: 'whimsical',
    hobbies: 'camping',
    price: '0-100',
    createAccount: false,
  };

  //What to send:
  // Array of Categories with products and the average score

  // console.log('whats here', req.body)
  const quizResults = req.body;
  console.log(quizResults);
  const minAge = parseInt(quizResults.age.split('-')[0]);
  const maxAge = parseInt(quizResults.age.split('-')[1]);
  const giftTypeArray = quizResults.type;
  let typeAndAgeFiltered = [];
  retriveProducts().then((allProducts) => {
    // console.log('everything', allProducts);
    // FILTER OUT AGES
    const minAgeFilter = allProducts.filter(
      (product) => parseInt(product.ageMin) <= maxAge
    );
    const ageFiltered = minAgeFilter.filter(
      (product) => parseInt(product.ageMax) >= minAge
    );
    // FILTER OUT GIFT TYPES
    if (giftTypeArray.length > 0) {
      typeAndAgeFiltered = ageFiltered.filter((product) =>
        giftTypeArray.includes(product.giftType.toString())
      );
    } else {
      typeAndAgeFiltered = ageFiltered;
    }

    calculateScore(typeAndAgeFiltered, quizResults).then((result) => {
      const arrayOfCategories = groupBy(result, 'category');
      const categories = Object.keys(arrayOfCategories);
      const scores = [];
      categories.forEach((category) => {
        let averageScore = 0;
        arrayOfCategories[category].forEach((product) => {
          averageScore += product.score;
        });
        // console.log('averageScore', averageScore);
        // console.log('categories', category);
        // console.log('amount', arrayOfCategories[category].length);

        averageScore = round10(
          averageScore / arrayOfCategories[category].length,
          -1
        );

        scores.push({ name: category, score: averageScore });
      });
      res.send({ categoryScores: scores, products: result });
    });
  });
});
