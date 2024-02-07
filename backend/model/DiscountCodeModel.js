const mongoose = require("mongoose");
const discountCodeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your coupoun name!"],
  },
  value: { type: Number, required: true },
  minAmount: { type: Number },
  maxAmount: { type: Number },
  selectedProduct: { type: String },
  shop: { type: Object, required: true },

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("DiscountCode", discountCodeSchema);
