import { autoInjectable, inject } from 'tsyringe';
import { IConversionsServiceAdapter } from '../adapters/conversion-services-adapter.interface';
import { IConversionsServiceFacade } from './converters-facade.interface';
import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'

@autoInjectable()
export class ConvertersFacade implements IConversionsServiceFacade {
  // Aqui a injeção dos adaptadores é pela inversão de dependências
  // e não pela regra de passagem de dados por camadas
  constructor(
    @inject('ConvertersAdapters')
    private adapters: IConversionsServiceAdapter[],
  ) {}

  public async getConversions({ baseCurrency, value }: GetConversionsRequestBody, shouldFail?: boolean) {
    let data: any = null;
    let conversions = {
      success: false,
    };

    for (const adapter of this.adapters) {
      data = await (adapter as IConversionsServiceAdapter).convertValue({ baseCurrency, value }, shouldFail);
      conversions = data; // { success, conversions?, error? }
      
      if (data.success) {
        break;
      }
    }

    return conversions;
  }
}
