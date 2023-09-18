const mongoose = require("mongoose");
require("dotenv").config();
mongoose.Promise = global.Promise;

mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const database = mongoose.connect(
  process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/Giftology",
  options
);
//     console.log('Connected to database.');
//     // require csvtojson

//     // Convert a csv file with csvtojson
// Assuming you have imported the necessary modules and established a connection to the database.

module.exports = database;
