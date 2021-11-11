const mongoose = require('mongoose');

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    product_name: {
      type: String,
      unique: true,
      immutable: true,
    },
    Category: { type: String },
    Website: { type: String },
    Link: { type: String },
    Flavor_text: { type: String },
    product_base_price: { type: String, maxlength: 20 },
    gender: { type: String },
    indoor_outdoor: { type: String },
    Age_min: { type: String },
    Age_max: { type: String },
    Occassions: { Type: Array },
    practical_whimsicial: { Type: String },
    hobbies_interests: { Type: Array },
    created_at: { type: Date, default: Date.now, immutable: true },
    updated_at: { type: Date },
  },
  { versionKey: false });



const Products = mongoose.model('products', productSchema);

module.exports = Products;
