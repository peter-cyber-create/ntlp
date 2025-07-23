import { MongoClient, Db } from 'mongodb';
import mongoose from 'mongoose';

// MongoDB connection string from environment
const MONGODB_URI = process.env.MONGODB_URI as string;
const MONGODB_DB = process.env.MONGODB_DB as string;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  );
}

// MongoDB Native Driver Connection
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();

  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

// Mongoose Connection with optimization
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectToMongoose() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('❌ MongoDB connection failed:', e);
    throw e;
  }

  return cached.conn;
}

// Database helper functions
export async function getCollection(collectionName: string) {
  const { db } = await connectToDatabase();
  return db.collection(collectionName);
}

// Close connections (useful for cleanup)
export async function closeDatabaseConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
  
  if (cached.conn) {
    await mongoose.disconnect();
    cached.conn = null;
    cached.promise = null;
  }
}

export default { connectToDatabase, connectToMongoose, getCollection, closeDatabaseConnection };
