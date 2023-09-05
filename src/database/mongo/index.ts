import { MongoClient as Mongo, Db } from "mongodb";
import * as dotenv from 'dotenv';

dotenv.config();

export const MongoClient = {
  client: undefined as unknown as Mongo,
  db: undefined as unknown as Db,
  
  async connect(): Promise<void> {
    console.log('process.env', process.env.MONGO_URL, process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD)
    const url = process.env.MONGO_URL || "mongodb://localhost:27017";
    const username = process.env.MONGO_USERNAME;
    const password = process.env.MONGO_PASSWORD;

    const client = new Mongo(url, { auth: { username, password } });
    const db = client.db("currencies-db");

    this.client = client;
    this.db = db;
  },
};