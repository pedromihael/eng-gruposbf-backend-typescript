import 'reflect-metadata';
import { autoInjectable, inject } from 'tsyringe';
import { ResponseBuilder } from '../entities/builders/response-builder';
import { Currency } from '../entities/core/currency';
import { Response } from '../entities/types/response';
import { IRepository } from '../entities/protocols/repository.interface';
import { constants } from '../entities/constants';
import { acceptableCurrencies } from './helpers/acceptable-currencies';
import { consoleLogger, fileLogger } from '../shared/logs/index';

@autoInjectable()
export class CreateConversionUseCase {
  private responseData = new ResponseBuilder().setRoute('/api/create-currency');

  constructor(
    @inject('CurrenciesRepository')
    private repository: IRepository<Currency>,
  ) {}

  async execute(requestBody: Currency): Promise<Response> {
    const isBodyValid = this.validateBody(requestBody);
    
    if (isBodyValid) {
      const response = await this.repository.create(requestBody)
      this.responseData.setStatus(200).setResponse(response);
    }

    return this.responseData.build();
  }

  private validateBody(requestBody) {
    const appendToLogMessage = 'POST /api/create-currency';

    if (!requestBody) {
      const logMessage = `${appendToLogMessage} - Unsuccessful request: ${constants.errors.userErrors.MISSING_REQUEST_BODY}`;

      consoleLogger.error(logMessage)
      fileLogger.error(logMessage)
      
      this.responseData.setStatus(400).setResponse({ message: constants.errors.userErrors.MISSING_REQUEST_BODY });
      return false;
    }

    if(requestBody) {
      if (typeof requestBody.code !== "string") {
        const message = `${constants.errors.userErrors.WRONG_PARAM_TYPE}: 'code' expected to be string - received ${typeof requestBody.code}`;
        const logMessage = `${appendToLogMessage} - Unsuccessful request: ${message}`;
        
        consoleLogger.error(logMessage)
        fileLogger.error(logMessage)

        this.responseData.setStatus(400).setResponse({ message });
        return false;
      }

      if (!acceptableCurrencies.includes(requestBody.code)) {
        const message = constants.errors.userErrors.CODE_NOT_SUPPORTED;
        const logMessage = `${appendToLogMessage} - Unsuccessful request: ${message}`;
        
        consoleLogger.error(logMessage)
        fileLogger.error(logMessage)
        
        this.responseData.setStatus(400).setResponse({ message });
        return false;
      }

      if (typeof requestBody.active !== "boolean") {
        const message = `${constants.errors.userErrors.WRONG_PARAM_TYPE}: 'active' expected to be boolean - received ${typeof requestBody.active}`;
        const logMessage = `${appendToLogMessage} - Unsuccessful request: ${message}`;
        
        consoleLogger.error(logMessage)
        fileLogger.error(logMessage)

        this.responseData.setStatus(400).setResponse({ message });
        return false;
      }
    }

    return true;
  }
}
