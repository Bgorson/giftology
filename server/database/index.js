const mongoose = require('mongoose');
require('dotenv').config();
let dataB = require('./schemas/database.json');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);
const Product = require('./schemas/Product');

mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const database = mongoose.connect(
  process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/Giftology',
  options
);
//     console.log('Connected to database.');
//     // require csvtojson

//     // Convert a csv file with csvtojson
// Product.deleteMany({});

// let cleanedupD = [];
// dataB.forEach((product) => {
//   console.log(product);
//   let splitGiftTypes = product.giftType.split(',');
//   let splitGiftTags = product.tags.split(',');
//   let splitGiftTagsSort = product.tags_sort.split(',');
//   let splitGiftTagsDisplay = product.tags_display.split(',');

//   let splitHobbiesInterests = product.hobbiesInterests
//     ? product.hobbiesInterests.split(',')
//     : null;
//   let splitOccasisons = product.ocassion ? product.ocassion.split(',') : null;

//   cleanedupD.push({
//     ...product,
//     giftType: splitGiftTypes,
//     tags: splitGiftTags,
//     tags_sort: splitGiftTagsSort,
//     hobbiesInterests: splitHobbiesInterests,
//     tags_display: splitGiftTagsDisplay,
//     ocassion: splitOccasisons,
//   });
// });
// console.log('cleanedupD', cleanedupD);
// //when parse finished, result will be emitted here.

// Product.collection.insertMany(cleanedupD);

module.exports = database;
