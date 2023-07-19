const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is Required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email id is required"],
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
      trim: true,
    },
    location: {
      city: { type: String },
    },
    country: {
      countryName: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
