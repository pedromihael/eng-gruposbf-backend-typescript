import 'reflect-metadata';
import { autoInjectable, inject } from 'tsyringe';
import { ResponseBuilder } from '../entities/builders/response-builder';
import { Currency } from '../entities/core/currency';
import { Response } from '../entities/custom-types/response';
import { IRepository } from '../entities/protocols/repository.interface';
import { constants } from '../entities/constants';
import { acceptableCurrencies } from './helpers/acceptable-currencies';
import { consoleLogger, fileLogger } from '../shared/logs/index';

@autoInjectable()
export class ListCurrenciesUseCase {
  private responseData = new ResponseBuilder();

  constructor(
    @inject('CurrenciesRepository')
    private repository: IRepository<Currency>,
  ) {}

  async execute(): Promise<Response> {
    let response = await this.repository.list();
    if (!response.length) {
      response = [
        { code: 'USD', active: true },
        { code: 'EUR', active: true },
        { code: 'INR', active: true },
      ]
    }
    this.responseData.setStatus(200).setResponse(response);

    consoleLogger.info(`GET /api/list-currencies - response ${JSON.stringify(response)}`);
    fileLogger.info(`GET /api/list-currencies - response ${JSON.stringify(response)}`);

    return this.responseData.build();
  }
}
