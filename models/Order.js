const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    name: String,
    phone: String,
    address: String,
  },
  items: [
    {
      name: String,
      quantity: Number,
      price: Number,
      imagePath: String,
    },
  ],
  total: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);