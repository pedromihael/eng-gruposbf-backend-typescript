import { MongoClient } from "../"
import { seeds } from "./data"
import * as dotenv from 'dotenv';
import { consoleLogger, fileLogger } from '../../../shared/logs/index';

dotenv.config();

export async function seedMongoDatabase() {
  try {
    const seeded = await MongoClient.db
      .collection("currencies")
      .insertMany(seeds);
    consoleLogger.info("Database seeded for the first time.");
    fileLogger.info("Database seeded for the first time.");
    
    return;
  } catch (error) {
    consoleLogger.info("Database has received seeds.");
    return;
  }
}