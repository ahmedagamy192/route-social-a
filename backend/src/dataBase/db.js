import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";


const connectToDataBase = async () => {
    try {
        const contact = await mongoose.connect(MONGO_URI);
        console.log("data base connect succesfully")
    } catch (error) {
        console.log("data base not connect");
        process.exit(1);
    }
}

export default connectToDataBase;