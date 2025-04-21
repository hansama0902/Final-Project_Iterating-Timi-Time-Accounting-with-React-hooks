import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas");
    return client.db("TimiTimeAccounting");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    process.exit(1);
  }
}
async function getCollection(name) {
  const database = await connectDB();
  return database.collection(name);
}

export { connectDB, getCollection };
