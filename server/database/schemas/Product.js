const mongoose = require('mongoose');

const { Schema } = mongoose;

const toArray = (string) => {
  if (string != []) {
    return string.split(',');
  } else {
    return string;
  }
};
const productSchema = new Schema({
  productId: { type: Number },
  productName: {
    type: String,
    unique: true,
  },
  category: { type: String },
  website: { type: String },
  htmlTag: { type: String },
  link: { type: String },
  flavorText: { type: String },
  productBasePrice: { type: String },
  gender: { type: String },
  indoorOutdoor: { type: String },
  ageMin: { type: String },
  ageMax: { type: String },
  occasion: { type: Array, set: toArray },
  giftType: { type: [String], set: toArray },
  hobbiesInterests: { type: Array, set: toArray },
  tags: { type: Array, set: toArray },
  directImageSrc: { type: String },
  listingId: { type: String },
  updated_at: { type: Date },
  score: { type: Number },
});

const Product = mongoose.model('Products', productSchema);
const log = (data) => console.log(JSON.stringify(data, undefined, 2));

module.exports = Product;
