const mongoose = require("mongoose");

const ShopModel = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Shop name!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email!"],
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
  },
  phoneNumber: {
    type: Number,
    required: true,
  },
  address: { type: String },
  zipcode: {
    type: String,
  },
  role: {
    type: String,
    default: "seller",
  },
  description: {
    type: String,
  },
  avatar: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Shop", ShopModel);
