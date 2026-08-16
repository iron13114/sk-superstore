const mongoose=require("mongoose")
const {Schema}=mongoose

const tierSchema = new mongoose.Schema({
  type: { type: String, enum: ['single', 'pack', 'carton'], required: true },
  label: { type: String, required: true },
  quantity: { type: Number, required: true },  
  price: { type: Number, required: true },
  discountPercentage: { type: Number, default: 0 },
  stockQuantity: { type: Number, required: true }
})

const productSchema= new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    discountPercentage: {
        type: Number,
        default: 0,
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    brand:{
        type:Schema.Types.ObjectId,
        ref:"Brand",
        required:true
    },
    stockQuantity:{
        type:Number,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
     tiers: [tierSchema]
},{timestamps:true,versionKey:false})

module.exports=mongoose.model('Product',productSchema)