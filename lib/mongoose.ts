import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined");
}

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cache = global.mongoose;

if (!cache) {
  cache = global.mongoose = { conn: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow",
      })
      .then((result) => {
        console.log("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB", error);
        throw error;
      });
  }

  cache.conn = await cache.promise;
  return cache.conn;
};

export default dbConnect;
