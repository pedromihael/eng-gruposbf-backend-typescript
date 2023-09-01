import { IRepository } from "../../../../entities/protocols/repository.interface";
import { Currency } from "../../../../entities/core/currency";

export class CurrenciesFakeRepository implements IRepository<Currency> {
  private fakeDatabase: Currency[] = new Array<Currency>();

  async create(params: Currency): Promise<Currency | null> {
    return new Promise((resolve, reject) => {
      this.fakeDatabase.push(params)
      resolve(params);
    })
  }

  async list(): Promise<Currency[] | any[]> {
    return new Promise((resolve, reject) => {
      resolve(this.fakeDatabase);
    })
  }
}