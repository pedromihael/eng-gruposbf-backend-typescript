import 'reflect-metadata';
import './injection-containers/registry';
import 'regenerator-runtime/runtime.js';
import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import routes from '../../interface-adapters/controllers/routes';
import { MongoClient } from "../../database/mongo";
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

async function main() {
  await MongoClient.connect();

  app.disable('x-powered-by');
  app.use(cors());
  app.use(bodyParser.json());
  app.use(routes);

  app.listen(PORT, () => {
    console.log(`Currency Converter API is running on port ${PORT}!`);
  });

}

main();