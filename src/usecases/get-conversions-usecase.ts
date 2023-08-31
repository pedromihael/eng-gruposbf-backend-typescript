import 'reflect-metadata';
import { autoInjectable, inject } from 'tsyringe';
import { ResponseBuilder } from '../entities/builders/response-builder';
import { IConversionsServiceFacade } from '../interface-adapters/gateways/facade/converters-facade.interface';

import { Currencies } from '../entities/types/currencies.d';
import { Response } from '../entities/types/response';
import { GetConversionsRequestBody } from '../entities/types/get-conversions-request-body.d'


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
    const conversions = this.convertersFacade.getConversions({ baseCurrency, value }, shouldFail);
    return conversions;
  }

  async execute(requestBody: GetConversionsRequestBody, shouldFail?: boolean): Promise<Response> {
    const responseData = new ResponseBuilder().setRoute('/api/converter');

    if (!requestBody || !requestBody?.value || requestBody?.baseCurrency && typeof requestBody?.baseCurrency !== 'string') {
      responseData.setStatus(422).setResponse({ message: 'Invalid request body. Body should contain `value` numerical field. If body contains `baseCurrency` it should be a string.'});
      return responseData.build();
    }

    const { baseCurrency, value } = requestBody;
    
    if(typeof value !== 'number') {
      responseData.setStatus(418).setResponse({ message: 'Input value is not a number.'});
      return responseData.build();
    }
    
    const data = await this.getConversions({ baseCurrency, value }, shouldFail);
    console.log('data', data)
    
    // Um ponto negativo desse estilo arquitetural é o prop drilling
    // sucessos e insucessos precisam ser notificados de camada em camada pra cima
    // até que os controllers saibam do resultado
    if(!data.success) {
      // TODO: (melhoria) substituir pelo ultimo array de rates salvo na base (ou cache, se possível)
      // Depois de fazer isso, remover o erro 500

      const message = data.error || 'External Service is down.'

      responseData.setStatus(503).setResponse({ message });
      return responseData.build();
    }

    const { conversions } = data;
    responseData.setStatus(200).setResponse(conversions);

    return responseData.build();
  }
}
