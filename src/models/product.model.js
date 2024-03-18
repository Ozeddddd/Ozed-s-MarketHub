import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    colour: {
        type: String,
    },
    specs: {
        type: String,
    }
})
export default mongoose.model('productModel', productSchema);