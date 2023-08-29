import { ExchangeRatesAPIAdapter } from '../adapters/ExchangeRatesAPIAdapter';
import { IConverterServicesFacade } from './IConverterServicesFacade';
import { GetConversionsRequestBody } from '../../entities/types/GetConversionsRequestBody'

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
