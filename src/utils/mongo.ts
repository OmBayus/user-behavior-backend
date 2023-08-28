import mongoose from "mongoose";
import { MONGODB_URI } from "./config";

console.log("Connecting to MongoDB");

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});
mongoose.connection.on("error", (err: any) => {
  console.error(err);
  console.log("MongoDB connection error. Please make sure MongoDB is running.");
  process.exit();
});

export default null;
