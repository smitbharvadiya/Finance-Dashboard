import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/finance-dashboard");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB Connection Error", error);
  }
};

export default connectDB;
