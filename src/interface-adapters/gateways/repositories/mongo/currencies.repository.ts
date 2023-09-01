import { IRepository } from "../../../../entities/protocols/repository.interface";
import { MongoClient } from "../../../../database/mongo";
import { Currency } from "../../../../entities/core/currency";
import { MongoIdCurrency } from "./currency.protocols";

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
    const currencies = await MongoClient.db
    .collection<Currency>("currencies")
    .find({})
    .toArray();

    return currencies;
  }
}

// create(body: P): Promise<T | null>;
// findBy(att: Partial<P>): Promise<T | null>;
// list(): Promise<T[] | any[]>;
// update(code: string, payload: Partial<P>): Promise<T>;