const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    product: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product', 
        required: true 
    },
    quantity: { 
        type: Number, 
        default: 1 
    },
    packagingTier: { 
        type: String, 
        default: 'single'   
    },
    variantLabel: { 
        type: String, 
        default: 'Single Unit' 
    },
    variantPrice: { 
        type: Number, 
        default: 0 
    }
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);