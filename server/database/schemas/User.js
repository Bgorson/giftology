const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
