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

  async findBy(att: string, value: any): Promise<Currency | null> {
    return new Promise((resolve, reject) => {
      const found = this.fakeDatabase.find(item => item[att] === value);
      resolve(found || null);
    })
  }

  async update(id: string, body: Partial<Currency>): Promise<Currency> {
    return new Promise((resolve, reject) => {
      const target = this.fakeDatabase.find(item => item.id === id);
      const removed = this.fakeDatabase.filter(item => item.id !== id);
      
      const toPush = { 
        code: body?.code || target?.code || '',
        active: body?.active || target?.active || false,
      };

      removed.push(toPush);
      this.fakeDatabase = removed;

      resolve(toPush);
    })
  }
}