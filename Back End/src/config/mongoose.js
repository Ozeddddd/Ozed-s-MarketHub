import mongoose from "mongoose";
import { config } from "dotenv";
config();

export async function ConnectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Successfuly connected to Database `);
    } catch( error ){
        console.log(`Failed to connect to MongoDB: ${error}`);
    }
}