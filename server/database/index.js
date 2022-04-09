const mongoose = require('mongoose');
require('dotenv').config();
const passport = require('passport');
const express = require('express');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const app = express();
const fs = require('mz/fs');
const { parse } = require('@fast-csv/parse');
const streamToIterator = require('stream-to-iterator');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);
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
  .then((db) =>
    (async function () {
      console.log('Connected to database.');

      try {
        // const conn = await mongoose.connect(
        //   process.env.DATABASE_URL || 'mongodb://127.0.0.1:27017/Giftology'
        // );

        await Promise.all(
          Object.entries(db.models).map(([k, m]) => m.deleteMany())
        );

        let headers = Object.keys(Product.schema.paths).filter(
          (k) => ['_id', '__v'].indexOf(k) === -1
        );

        console.log(headers);

        let stream = fs
          .createReadStream('./database.csv')
          .pipe(parse({ headers }));
        const iterator = await streamToIterator(stream).init();

        let buffer = [],
          counter = 0;

        for (let docPromise of iterator) {
          let doc = await docPromise;

          buffer.push(doc);
          counter++;

          if (counter > 10000) {
            await Product.insertMany(buffer);
            buffer = [];
            counter = 0;
          }
        }

        if (counter > 0) {
          await Product.insertMany(buffer);

          buffer = [];
          counter = 0;
        }
      } catch (e) {
        console.error(e);
      }
    })()
  )
  .catch((err) => console.error('Error connecting to database:', err));

module.exports = database;
