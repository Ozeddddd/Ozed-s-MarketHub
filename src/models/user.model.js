import mongoose from "mongoose";
import { stringify } from "querystring";

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        lowercase: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    userType: {
        type: String,
        required: true,
        enum: ['vendor', 'buyer']
    },
    emailToken: {
        type: String,
    }
},{timestamps: true}
)

export default mongoose.model('User', userSchema);