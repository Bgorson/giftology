const express = require("express");
const pool = require("./dataBaseSQL/db");
const data = require("./databaseNOSQL/schemas/database.json");
const path = require("path");

const bodyParser = require("body-parser");
const session = require("express-session");

// Call the function with your data

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
app.post("/insertProducts", async (req, res) => {
  const productsToInsert = data;

  const insertQuery = `
    INSERT INTO products (
      product_id, product_name, category, website, html_tag, link, flavor_text,
      lab_results, product_base_price, gender, who_ind, age_min, age_max, occasion, gift_type, hobbies_interests,
      tags, tags_sort, tags_display, product_card_banner, direct_image_src, listing_id, review_link, discount_codes
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24
    )
  `;

  try {
    await Promise.all(
      productsToInsert.map(async (product) => {
        const {
          productId,
          productName,
          category,
          website,
          htmlTag,
          link,
          flavorText,
          labResults,
          productBasePrice,
          ageMin,
          ageMax,
          giftType,
          hobbiesInterests,
          tags,
          tags_sort,
          listingId,
          gender,
          who_ind,
          occasion,
          tags_display,
          product_card_banner,
          directImageSrc,
          review_link,
          discount_codes,
        } = product;

        await pool.query(insertQuery, [
          productId,
          productName,
          category,
          website,
          htmlTag,
          link,
          flavorText,
          labResults,
          productBasePrice,
          gender,
          who_ind,
          ageMin,
          ageMax,
          occasion,
          giftType,
          hobbiesInterests,
          tags,
          tags_sort,
          tags_display,
          product_card_banner,
          directImageSrc,
          listingId,
          review_link,
          discount_codes,
        ]);
      })
    );

    res.status(200).json({ message: "Products inserted successfully" });
  } catch (error) {
    console.error("Error inserting products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.listen(port, () => console.log(`Server is listening on port ${port}`));
