import 'reflect-metadata';
import { autoInjectable, inject } from 'tsyringe';
import { ResponseBuilder } from '../entities/builders/response-builder';
import { Currency } from '../entities/core/currency';
import { Response } from '../entities/types/response';
import { IRepository } from '../entities/protocols/repository.interface';
import { constants } from '../entities/constants';
import { acceptableCurrencies } from './helpers/acceptable-currencies';

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
    if (!requestBody) {
      this.responseData.setStatus(400).setResponse({ message: constants.errors.userErrors.MISSING_REQUEST_BODY });
      return false;
    }

    if(requestBody) {
      if (typeof requestBody.code !== "string") {
        this.responseData.setStatus(400).setResponse({ message: `${constants.errors.userErrors.WRONG_PARAM_TYPE}: 'code' expected to be string - received ${typeof requestBody.code}` });
        return false;
      }

      if (!acceptableCurrencies.includes(requestBody.code)) {
        this.responseData.setStatus(400).setResponse({ message: constants.errors.userErrors.CODE_NOT_SUPPORTED });
        return false;
      }

      if (typeof requestBody.active !== "boolean") {
        this.responseData.setStatus(400).setResponse({ message: `${constants.errors.userErrors.WRONG_PARAM_TYPE}: 'active' expected to be boolean - received ${typeof requestBody.active}` });
        return false;
      }
    }

    return true;
  }
}
