const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: [true, "Name is required"]
  },
  description: {
    type: String,
    required: [true, "Description is required"]
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String
  },
  phoneNumber: Number
});

module.exports = mongoose.model("Product", productSchema);
