import { IRepository } from "../../../../entities/protocols/repository.interface";
import { MongoClient } from "../../../../database/mongo";
import { Currency } from "../../../../entities/core/currency";
import { MongoIdCurrency } from "./currency.protocols";
import { fileLogger, consoleLogger } from '../../../../shared/logs/index';
import { ObjectId } from 'mongodb';

export class CurrenciesMongoRepository implements IRepository<Currency> {
  async create(params: Currency): Promise<Currency | null> {
    const { insertedId } = await MongoClient.db
    .collection("currencies")
    .insertOne(params);

    if (!insertedId) {
      return null;
    }

    const created: MongoIdCurrency = await MongoClient.db
    .collection<Currency>("currencies")
    .findOne({ _id: insertedId });

    return created;
  }

  async list(): Promise<Currency[] | any[]> {
    const mongoResponse = await MongoClient.db
    .collection<Currency>("currencies")
    .find({})
    .toArray();

    const currencies = mongoResponse?.map(currency => { 
      const { _id, ...entry } = currency;
      return entry;
     })

    return currencies;
  }

  async update(id: string, params: Partial<Currency>): Promise<Currency> {
    await MongoClient.db.collection("currencies").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...params,
        },
      }
    );

    const updated: MongoIdCurrency = await MongoClient.db
    .collection<Currency>("currencies")
    .findOne({ _id: new ObjectId(id) });

    return updated;
  }

  async findBy(param: string, value: string): Promise<Currency | null> {
    const found: MongoIdCurrency = await MongoClient.db
    .collection<Currency>("currencies")
    .findOne({ [param]: value });

    const { _id, ...rest } = found;
    return { id: _id.toString(), ...rest };
  }
}