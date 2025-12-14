import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", true);

const connectDB = async () => {
  const uri = process.env.MONGO_URL;
  if (!uri) console.log("MongoDB connection string is missing");

  mongoose.connection.on("connected", () =>
    console.log("MongoDB connected successfully")
  );
  mongoose.connection.on("error", (err) =>
    console.log(`MongoDB connection error: ${err}`)
  );
  mongoose.connection.on("disconnected", () =>
    console.log("MongoDB disconnected")
  );
  await mongoose.connect(uri, { autoIndex: true });
};


export default connectDB; 