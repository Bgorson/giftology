const mongoose = require('mongoose');
const R = require('ramda');

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },
    category: { type: String, required: true },
    website: { type: String, required: true },
    link: { type: String },
    flavor_text: { type: String, maxlength: 20 },
    product_base_price: { type: String, maxlength: 20 },
    gender: { type: String, maxlength: 240 },
    indoor_outdoor: { type: String },
    age_min: { type: String },
    age_max: { type: String },
    occassions: { Type: Array },
    practical_whimsicial: { Type: String },
    hobbies_interests: { Type: Array },
    created_at: { type: Date, default: Date.now, immutable: true },
    updated_at: { type: Date },
  },
  { versionKey: false });



const Product = mongoose.model('Product', productSchema);

module.exports = Product;
