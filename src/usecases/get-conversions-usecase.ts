import 'reflect-metadata';
import { autoInjectable, inject } from 'tsyringe';
import { ResponseBuilder } from '../entities/builders/response-builder';
import { IConverterServicesFacade } from '../interface-adapters/gateways/facade/converters-facade.interface';

import { Currencies } from '../entities/types/currencies';
import { Response } from '../entities/types/response';
import { GetConversionsRequestBody } from '../entities/types/get-conversions-request-body.d'


// Receber a fachada como dependência injetada é necessário
// para respeitar a comunicação entre camadas.
// A fachada está na camada Interface Adapters, acima dos use cases. 
@autoInjectable()
export class GetConversionsUseCase {
  constructor(
    @inject('ConvertersFacade')
    private convertersFacade: IConverterServicesFacade,
  ) {}

  private getConversions({ baseCurrency, value }: GetConversionsRequestBody) {
    const conversions = this.convertersFacade.getConversions({ baseCurrency, value });
    return conversions;
  }

  async execute({ baseCurrency, value }: GetConversionsRequestBody): Promise<Response> {
    const responseData = new ResponseBuilder().setRoute('/api/converter');
    
    if(typeof value !== 'number') {
      responseData.setStatus(500).setResponse({ message: 'Input value is not a number'});
      return responseData.build();
    }
    
    const data = await this.getConversions({ baseCurrency, value });
    console.log('data', data)
    
    // Um ponto negativo desse estilo arquitetural é o prop drilling
    // sucessos e insucessos precisam ser notificados de camada em camada pra cima
    // até que os controllers saibam do resultado
    if(!data.success) {
      // TODO: (melhoria) substituir pelo ultimo array de rates salvo na base (ou cache, se possível)
      // Depois de fazer isso, remover o erro 500
      responseData.setStatus(500).setResponse({ message: 'External Service is down'});
      return responseData.build();
    }

    const { conversions } = data;
    responseData.setStatus(200).setResponse(conversions);

    return responseData.build();
  }
}
