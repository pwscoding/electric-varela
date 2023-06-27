const mongoose = require('mongoose');

// Define the Services schema
const ServicesSchema = new mongoose.Schema({
  service_title: { type: String, required: true },
  service_category_name: { type: String, required: true },
  description: { type: String, required: true, maxlength: 20000 },
  contactTitle: { type: String, required: true },
  contactDescription: { type: String, required: true },
  contactNumber: { type: String, required: true },
  facebook: { type: String },
  instagram: { type: String },
  whatsapp: { type: String },
  imageBreadcrumb:{type:String},
  imageBody:{type:String}
});

// Create the ContactDetails model
const Services = mongoose.model('Services', ServicesSchema);

module.exports = Services;
