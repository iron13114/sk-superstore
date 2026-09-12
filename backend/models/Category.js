const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true
        },
        icon: {
            type: String,
            default: "📦"
        },
        image: {
            type: String,
            default: ""        
        },
        parent: {
            type: Schema.Types.ObjectId,
            ref: "Category",
            default: null     
        },
        order: {
            type: Number,
            default: 0       
        }
    },
    { timestamps: true }
);

categorySchema.virtual("children", {
    ref: "Category",
    localField: "_id",
    foreignField: "parent"
});

categorySchema.set("toJSON", { virtuals: true });
categorySchema.set("toObject", { virtuals: true });

categorySchema.index({ parent: 1 });

module.exports = mongoose.model("Category", categorySchema);