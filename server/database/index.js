const mongoose = require('mongoose');
require('dotenv').config();
const stream = require('stream');
const util = require('util');
const fs = require('fs');
var csv = require('csvtojson');
var assert = require('assert');

const { parse } = require('@fast-csv/parse');
const streamToIterator = require('stream-to-iterator');
mongoose.Promise = global.Promise;
// mongoose.set('debug', true);
const Product = require('./schemas/Product');

mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const database = mongoose
  .connect(
    process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/Giftology',
    options
  )
  .then((db) => {
    console.log('Connected to database.');
    // require csvtojson

    // Convert a csv file with csvtojson
    csv()
      .fromFile('database.csv')
      .then(async function (jsonArrayObj) {
        //when parse finished, result will be emitted here.
        await Product.findOneAndUpdate(jsonArrayObj, function (err, r) {
          assert.equal(null, err);
          assert.equal(3, r.insertedCount);
        });
      });
  });

module.exports = database;
