const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  foodType: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [String], // Array of image URLs
  ad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ad",
  },
  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Menu",
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
