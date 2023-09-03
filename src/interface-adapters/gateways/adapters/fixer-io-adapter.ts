import { IConversionsServiceAdapter } from './conversion-services-adapter.interface';
import { FixerIOAPI } from '../../../external/services/fixer-io';
import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'
import { autoInjectable, inject } from 'tsyringe';
import { IRepository } from '../../../entities/protocols/repository.interface';
import { Currency } from '../../../entities/core/currency';

@autoInjectable()
export class FixerIOAdapter implements IConversionsServiceAdapter {
  private converter!: FixerIOAPI;
  private serviceEndpoint: string;

  constructor() {
    this.converter = new FixerIOAPI();
    this.serviceEndpoint = '';
  }

  private async getCurrenciesFromDatabase(repository: IRepository<Currency>) {
    const currencies = await repository.list();
    const activeCurrencies = currencies?.filter(item => item.active);
    const codes = activeCurrencies?.map(item => { return item.code });

    return codes.length ? codes : ['USD', 'EUR', 'INR', 'BRL'];
  }

  public async convertValue({ baseCurrency = 'BRL', value }: GetConversionsRequestBody, repository: IRepository<Currency>): Promise<any> {
    const currencies = await this.getCurrenciesFromDatabase(repository);
    const { data, endpoint } = await this.converter.getCurrencies();

    this.serviceEndpoint = endpoint;
    
    const convertTo = currencies.filter(c => c !== (baseCurrency));

    if (data.result !== 'success') {
      return { success: false, error: data['error-type'] }
    }

    const rateBRL = data.rates['BRL'];
    const valueInEuro = value/rateBRL;

    const conversionsMap = {}

    convertTo.forEach(currency => {
      Object.assign(conversionsMap, { [currency]: parseFloat((valueInEuro*data.rates[currency]).toFixed(2)) })
    });

    return {
      success: true,
      conversions: conversionsMap
    }
  }

  public getServiceEndpoint(): string {
    return this.serviceEndpoint;
  }

}
