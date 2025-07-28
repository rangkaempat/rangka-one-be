import dotenv from "dotenv";
dotenv.config();

// TODO: Figure out why .env variables aren't loaded in other files

import mongoose from "mongoose";

const DB_URI = process.env.DB_URI;
const NODE_ENV = process.env.NODE_ENV;

// Verify DB_URI existence
if (!DB_URI) {
  throw new Error("Please define DB_URI environment variable");
}

const connectDatabase = async () => {
  try {
    await mongoose.connect(DB_URI);

    console.log(`Connect to database in ${NODE_ENV} mode`);
  } catch (error) {
    console.error("Error connecting to database: ", error);
    process.exit(1);
  }
};

export default connectDatabase;
