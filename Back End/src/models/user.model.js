import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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
},{timestamps: true,
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            delete ret.__v;
            return ret;
        },
    },
}
);
userSchema.methods.generateAuthToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};
//exporting the user model where the first argument is the name of the model and the second argument is the schema 
export default mongoose.model('User', userSchema);