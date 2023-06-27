const mongoose = require('mongoose');

const enquirySchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String },
  message: { type: String, required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number },
  response: { type: String },
  isResolved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['user', 'guest'], required: true, default: 'guest' },
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

module.exports = Enquiry;
