const mongoose = require('mongoose');

// Define the schema
const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  material: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    required: true,
  },
  weight: {
    type: String,
    required: true,
  },
  cta: {
    type: String
  },
  images0:{ type: Array},
  images1:{ type: Array},
  images2:{ type: Array},
  images3:{ type: Array},
  images4:{ type: Array},
  images5:{ type: Array},
});

// Create a model based on the schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
