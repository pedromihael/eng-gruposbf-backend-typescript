import { ExchangeRatesAPIAdapter } from '../adapters/exchange-rates-api-adapter';
import { IConverterServicesFacade } from './converters-facade.interface';
import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'

export class ConvertersFacade implements IConverterServicesFacade {
  private exchangeRatesAPIadapter: ExchangeRatesAPIAdapter;

  constructor() {
    this.exchangeRatesAPIadapter = new ExchangeRatesAPIAdapter();
  }

  public async getConversions({ baseCurrency, value }: GetConversionsRequestBody) {
    const conversions = await this.exchangeRatesAPIadapter.convertValue({ baseCurrency, value });

    return conversions;
  }
}
