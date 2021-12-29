const express = require('express');
// const { requireAuth } = require('./middleware');
const { Product } = require('../database/schemas');
const amazonScraper = require('amazon-buddy');

const router = express.Router();

module.exports = router;

async function retriveProducts() {
  const allProducts = await Product.find({});

  return await allProducts;
}

//TODO: Do all of the scoring in one function
// Average the scores after all individual products have been scored

async function calculateScore(ageFiltered, quizResults) {
  const minPrice = parseInt(quizResults.price.split('-')[0]);
  const maxPrice = parseInt(quizResults.price.split('-')[1]);
  const filteredArray = ageFiltered;
  filteredArray.forEach(function (product) {
    let score = 0;
    if (product.indoorOutdoor == quizResults.prefer) {
      // console.log('matching indoor', product.productName);
      score++;
    }
    const array = product.hobbiesInterests.toString().split(',');
    const lowerCase = array.map((array) => array.toLowerCase());
    quizResults.hobbies.forEach((hobby) => {
      if (lowerCase.includes(hobby)) {
        // console.log('matching hobby', product.productName);

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
    console.log('product Price', product.score);
    console.log('product name', product.productName);
  });
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

  retriveProducts().then((allProducts) => {
    // console.log('everything', allProducts);
    const minAgeFilter = allProducts.filter(
      (product) => parseInt(product.ageMin) <= maxAge
    );
    const ageFiltered = minAgeFilter.filter(
      (product) => parseInt(product.ageMax) >= minAge
    );

    calculateScore(ageFiltered, quizResults).then((result) => {
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

        averageScore = Math.floor(
          averageScore / arrayOfCategories[category].length
        );
        scores.push({ name: category, score: averageScore });
      });
      res.send({ categoryScores: scores, products: result });
    });
  });
});

// router.get("/category/:name", async (req, res) => {
//   const category = req.params.name;
//   try {
//     const categoryRes = await Product.find({ Category: category });
//     res.send(categoryRes);
//   } catch {
//     res.status(404);
//     res.send({ error: "Category name error" });
//   }
// });

// router.post("/add_product", async (request, response) => {
//   const newProduct = new Product(request.body);

//   console.log(newProduct);
//   await newProduct.save();
//   response.send({ message: "Product added successfully", newProduct });
// });
