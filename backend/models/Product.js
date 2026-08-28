const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },                 
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  stockQuantity: { type: Number, default: 0 },
  packagingTier: { type: String },                         
  prices: {                                                
    single: Number,
    pack: Number,
    carton: Number
  },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);