const mongoose = require('mongoose');

const tierSchema = new mongoose.Schema({
  type: { type: String, required: true },          
  label: { type: String, required: true },          
  price: { type: Number, required: true },         
  discountPercentage: { type: Number, default: 0 },
  stockQuantity: { type: Number, default: 0 }
}, { _id: true });

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },          
  discountPercentage: { type: Number, default: 0 },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stockQuantity: { type: Number, default: 0 },     
  thumbnail: { type: String },
  images: [{ type: String }],
  tiers: [tierSchema],                             
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);