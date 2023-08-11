const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");

require("./database");

require("./config/environment");

const routes = require("./routes/index");

const port = process.env.PORT;
const app = express();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}
const sess = {
  secret: "Super secret secret",
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

app.use(session(sess));

app.use(bodyParser.json());

app.use("/api", routes);
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
