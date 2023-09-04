import 'reflect-metadata';
import { autoInjectable, inject } from 'tsyringe';
import { ResponseBuilder } from '../entities/builders/response-builder';
import { IConversionsServiceFacade } from '../interface-adapters/gateways/facade/converters-facade.interface';

import { Currencies } from '../entities/types/currencies.d';
import { Response } from '../entities/types/response';
import { GetConversionsRequestBody } from '../entities/types/get-conversions-request-body.d'

import { constants } from '../entities/constants';
import { fileLogger, consoleLogger } from '../shared/logs/index';

// Receber a fachada como dependência injetada é necessário
// para respeitar a comunicação entre camadas.
// A fachada está na camada Interface Adapters, acima dos use cases. 
@autoInjectable()
export class GetConversionsUseCase {
  constructor(
    @inject('ConvertersFacade')
    private convertersFacade: IConversionsServiceFacade,
  ) {}

  private getConversions({ baseCurrency, value }: GetConversionsRequestBody, shouldFail?: boolean) {
    const response = this.convertersFacade.getConversions({ baseCurrency, value }, shouldFail);
    return response;
  }

  async execute(requestBody: GetConversionsRequestBody, shouldFail?: boolean): Promise<Response> {
    const responseData = new ResponseBuilder();

    if (!requestBody || !requestBody?.value || requestBody?.baseCurrency && typeof requestBody?.baseCurrency !== 'string') {
      responseData.setStatus(422).setResponse({ message: constants.errors.userErrors.MISSING_VALUE_OR_BASE_CURRENCY });
      return responseData.build();
    }

    const { baseCurrency, value } = requestBody;
    
    if(typeof value !== 'number') {
      responseData.setStatus(418).setResponse({ message: constants.errors.userErrors.NON_NUMERICAL_VALUE });
      return responseData.build();
    }
    
    const { conversions: data, serviceEndpoint } = await this.getConversions({ baseCurrency, value }, shouldFail);

    // Um ponto negativo desse estilo arquitetural é o prop drilling
    // sucessos e insucessos precisam ser notificados de camada em camada pra cima
    // até que os controllers saibam do resultado
    
    if(!data.success) {
      const message = data.error || constants.errors.serverErrors.EXTERNAL_SERVICE_DOWN;

      consoleLogger.error(message);
      fileLogger.error(message);

      responseData.setStatus(503).setResponse({ message });
      return responseData.build();
    }

    const { conversions } = data;

    consoleLogger.info(`Conversion successfully done: ${baseCurrency} ${value} in ${serviceEndpoint}`)
    fileLogger.info(`Conversion successfully done: ${baseCurrency} ${value} in ${serviceEndpoint} -> ${JSON.stringify(conversions)}`)
    
    responseData.setStatus(200).setResponse(conversions);
    return responseData.build();
  }
}
