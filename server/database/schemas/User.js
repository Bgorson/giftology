const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    userData: {
      id: { type: String, required: false },
      quizResults: {
        who: { type: String, required: false },
        name: { type: String, required: false },
        age: { type: String, required: false },
        occasion: { type: String, required: false },
        hobbies: { type: Array, required: false },
        type: { type: Array, required: false },
        tags: { type: Array, required: false },
        createAccount: { type: String, required: false },
        type: Object,
        required: false,
      },
      wishList: { type: Array, required: false },
      type: Array,
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
