const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    userData: { type: Array, required: false },
    // Shape: [{ quizData: {}, wishList:[]}]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
