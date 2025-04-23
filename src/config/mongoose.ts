import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const { MONGO_URI } = process.env;

if (!MONGO_URI) {
  throw new Error(
    "MONGO_URI missing. Paste the full mongodb+srv:// string from Atlas into .env"
  );
}

export const initMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[Mongo] connected");
  } catch (err) {
    console.error("[Mongo] connection error:", err);
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await mongoose.disconnect();
  process.exit(0);
});
