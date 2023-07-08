const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please enter a title"],
    },
    description: {
      type: String,
      required: [true, "Please enter a description"],
    },
    price: {
      type: Number,
      required: [true, "Please enter a price"],
    },
    image: {
      type: String,
      required: [true, "Please upload an image"],
    },
    category: {
      type: String,
      required: [true, "Please enter a category"],
    },
    quantity: {
      type: Number,
      required: [true, "Please enter a quantity"],
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("product", productSchema);

module.exports = Product;
