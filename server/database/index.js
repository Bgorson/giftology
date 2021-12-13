const mongoose = require("mongoose");
require("dotenv").config();
const passport = require("passport");
const express = require("express");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const app = express();

mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};



const database = mongoose
  .connect(process.env.DATABASE_URL, options)
  .then(() => console.log("Connected to database."))
  .catch((err) => console.error("Error connecting to database:", err.message));

module.exports = database;
