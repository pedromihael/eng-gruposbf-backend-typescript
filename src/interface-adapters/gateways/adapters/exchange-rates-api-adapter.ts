import { IConversionsServiceAdapter } from './conversion-services-adapter.interface';
import { ExchangeRatesAPI } from '../../../external/services/exchange-rates-api';
import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'
import { autoInjectable, inject } from 'tsyringe';
import { IRepository } from '../../../entities/protocols/repository.interface';
import { Currency } from '../../../entities/core/currency';

@autoInjectable()
export class ExchangeRatesAPIAdapter implements IConversionsServiceAdapter {
  private converter!: ExchangeRatesAPI;

  constructor() {
    this.converter = new ExchangeRatesAPI();
  }

  private async getCurrenciesFromDatabase(repository: IRepository<Currency>) {
    const currencies = await repository.list();
    const activeCurrencies = currencies?.map(item => item.active && item.code)

    return activeCurrencies.length ? activeCurrencies : ['USD', 'EUR', 'INR', 'BRL'];
  }

  public async convertValue({ baseCurrency = 'BRL', value }: GetConversionsRequestBody, repository: IRepository<Currency>) {
    const currencies = await this.getCurrenciesFromDatabase(repository);
    const data = await this.converter.getCurrencies(baseCurrency);
    
    const convertTo = currencies.filter(c => c !== (baseCurrency));

    if (data.result !== 'success') {
      return { success: false, error: data['error-type'] }
    }

    const conversionsMap = {}

    convertTo.forEach(currency => {
      Object.assign(conversionsMap, { [currency]: parseFloat((value*data.rates[currency]).toFixed(2)) })
    });

    return {
      success: true,
      conversions: conversionsMap
    }
  }

}
