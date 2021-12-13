const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const session = require("express-session");

const {User} = require("./database/schemas");

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "1009874905788-4eotoe38h0ppnmuv672ng5nccvd2sce0.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate(
        { googleId: profile.id, username: profile.id },
        function (err, user) {
          return cb(err, user);
        }
      );
    }
  )
);

require("./config/environment");
require("./database");

const routes = require("./routes/index");

const assetFolder = path.resolve(__dirname, "../dist/");
const port = process.env.PORT;
const app = express();
app.use(session({
  secret: "Our little secret.",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "http://localhost:3000" }),
  function (req, res) {
    console.log("authed")
    // Successful authentication, redirect secrets.
    res.redirect("http://localhost:3000");
  }
);
app.get("/logout", function (req, res) {
  res.redirect("http://localhost:3000/");
});
app.use(express.static(assetFolder));
app.use(bodyParser.json());


app.use("/", routes);

app.listen(port, () => console.log(`Server is listening on port ${port}`));
