const mongoose = require('mongoose');

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
    htmlTag: { type: String },
    flavorText: { type: String },
    productBasePrice: { type: String, maxlength: 20 },
    gender: { type: String },
    indoorOutdoor: { type: String },
    ageMin: { type: String },
    ageMax: { type: String },
    occasion: { Type: String },
    tags: { Type: Array },
    giftType: { Type: String },
    hobbiesInterests: { Type: Array },
    updated_at: { type: Date },
    score: { type: Number },
    directImageSrc: { type: String },
    listingId: { type: Number },
  },
  { versionKey: false }
);

const Product = mongoose.model('products', productSchema);

module.exports = Product;
