import 'reflect-metadata';
import 'regenerator-runtime/runtime.js';
import './injection-containers/registry';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import routes from '../../interface-adapters/controllers/routes';
import { MongoClient } from "../../database/mongo";
import { seedMongoDatabase } from "../../database/mongo/seeds/seed-database";
import * as dotenv from 'dotenv';
import { consoleLogger } from '../../shared/logs/index';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../../docs/swagger/config.json'

dotenv.config();

const PORT = process.env.CURRENCIES_API_PORT || 3000;
const app = express();

async function main() {
  await MongoClient.connect();
  await seedMongoDatabase();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(bodyParser.json());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(routes);

  app.listen(PORT, () => {
    consoleLogger.info(`Currency Converter API is running on port ${PORT}!`);
  });

}

main();