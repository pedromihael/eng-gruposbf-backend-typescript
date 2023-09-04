import 'reflect-metadata';
import { autoInjectable, inject } from 'tsyringe';
import { ResponseBuilder } from '../entities/builders/response-builder';

import { Response } from '../entities/custom-types/response';

import { constants } from '../entities/constants';
import { fileLogger, consoleLogger } from '../shared/logs/index';
import { Currency } from '../entities/core/currency';
import { IRepository } from '../entities/protocols/repository.interface';

// Receber a fachada como dependência injetada é necessário
// para respeitar a comunicação entre camadas.
// A fachada está na camada Interface Adapters, acima dos use cases. 
@autoInjectable()
export class UpdateCurrencyUseCase {
  constructor(
    @inject('CurrenciesRepository')
    private repository: IRepository<Currency>,
  ) {}

  async execute(requestBody: Partial<Currency>): Promise<Response> {
    const responseData = new ResponseBuilder();

    const { code } = requestBody;

    const storedCurrency = await this.repository.findBy('code', code);
    
    if (!storedCurrency) {
      const message = constants.errors.userErrors.CURRENCY_NOT_FOUND;
      consoleLogger.error(message);
      responseData.setStatus(404).setResponse({ message });

      return responseData.build();
    }

    const updated = await this.repository.update(storedCurrency.id as string, requestBody);

    if (!updated) {
      const message = constants.errors.userErrors.CURRENCY_NOT_UPDATED;
      consoleLogger.error(message);
      responseData.setStatus(400).setResponse({ message });

      return responseData.build();
    }

    return responseData.setStatus(200).setResponse(updated).build();
  }
}
