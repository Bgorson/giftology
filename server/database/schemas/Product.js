const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    productName: {
      type: String,
      unique: true,
      immutable: true,
    },
    productId: { type: String },
    category: { type: String },
    website: { type: String },
    link: { type: String },
    flavorText: { type: String },
    productBasePrice: { type: String, maxlength: 20 },
    gender: { type: String },
    indoorOutdoor: { type: String },
    ageMin: { type: String },
    ageMax: { type: String },
    occassions: { Type: Array },
    // tags: { Type: String },
    practicalWhimsicial: { Type: String },
    hobbiesInterests: { Type: Array },
    // created_at: { type: Date, default: Date.now, immutable: true },
    updated_at: { type: Date },
    score: { type: Number },
  },
  { versionKey: false }
);

const Products = mongoose.model("products", productSchema);

module.exports = Products;
