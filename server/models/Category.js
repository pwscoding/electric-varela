const mongoose = require('mongoose');

// Define the Category schema
const CategorySchema = new mongoose.Schema({
  category_name: { type: String, required: true },
  imageCategory: { type: String },
});

// Create the ContactDetails model
const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;
