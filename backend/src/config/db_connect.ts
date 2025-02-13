import mongoose from "mongoose";

async function db_connect(url: string | undefined) {
    if (!url) {
        console.error("MongoDB URL is not defined");
        return;
    }
    try {
        await mongoose.connect(url);
        console.log("Database connected");
    } catch (err) {
        console.error("Connection error:", err);
    }
}

export default db_connect;
