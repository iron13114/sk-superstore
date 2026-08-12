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
        required: function() { return !this.user; } 
    },
    guestPhone: {       
        type: String,
        required: function() { return !this.user; }
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
        enum: ['COD'],
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