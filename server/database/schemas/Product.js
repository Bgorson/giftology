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
    tags: { Type: String },
    giftType: { Type: String },
    hobbiesInterests: { Type: Array },
    // created_at: { type: Date, default: Date.now, immutable: true },
    updated_at: { type: Date },
    score: { type: Number },
    directImageSrc: { type: String },
    listingId: { type: Number },
  },
  { versionKey: false }
);

const Products = mongoose.model('products', productSchema);

module.exports = Products;
