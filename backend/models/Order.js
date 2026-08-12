const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: false,
        default: null,
        sparse: true
    },
    guestEmail: {
        type: String,
        required: false
    },
    guestPhone: {
        type: String,
        required: false
    },
    item: {
        type: [Schema.Types.Mixed],
        required: true
    },
    address: {
        type: [Schema.Types.Mixed],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Dispatched', 'Out for delivery', 'Cancelled'],
        default: 'Pending'
    },
    paymentMode: {
        type: String,
        enum: ['COD', 'UPI', 'CARD'],
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, { versionKey: false });

module.exports = mongoose.model("Order", orderSchema);