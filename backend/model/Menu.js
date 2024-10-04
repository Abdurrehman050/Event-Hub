const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [String],
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ad",
  },
});

const Menu = mongoose.model("Menu", menuSchema);
module.exports = Menu;
