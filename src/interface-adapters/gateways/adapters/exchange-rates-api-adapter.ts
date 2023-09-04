import { IConversionsServiceAdapter } from './conversion-services-adapter.interface';
import { ExchangeRatesAPI } from '../../../external/services/exchange-rates-api';
import { GetConversionsRequestBody } from '../../../entities/custom-types/get-conversions-request-body.d'
import { autoInjectable, inject } from 'tsyringe';
import { IRepository } from '../../../entities/protocols/repository.interface';
import { Currency } from '../../../entities/core/currency';
import { fileLogger, consoleLogger } from '../../../shared/logs/index';

@autoInjectable()
export class ExchangeRatesAPIAdapter implements IConversionsServiceAdapter {
  private converter!: ExchangeRatesAPI;
  private serviceEndpoint: string;
  private rates: any[];

  constructor() {
    this.converter = new ExchangeRatesAPI();
    this.serviceEndpoint = '';
    this.rates = [];
  }

  public async convertValue({ baseCurrency = 'BRL', value }: GetConversionsRequestBody, currencies: string[]): Promise<any> {
    const { data, endpoint } = await this.converter.getCurrencies(baseCurrency);

    this.serviceEndpoint = endpoint;
    
    const convertTo = currencies.filter(c => c !== (baseCurrency));

    if (data.result !== 'success') {
      return { success: false, error: data['error-type'] }
    }

    for (const [key, value] of Object.entries(data.rates)) {
      this.rates.push({ currency: key, value })
    }
    
    const conversionsMap = {}

    convertTo.forEach(currency => {
      Object.assign(conversionsMap, { [currency]: parseFloat((value*data.rates[currency]).toFixed(2)) })
    });

    const message = `POST /api/converter - Exchange Rates Response: ${JSON.stringify(conversionsMap)}`
    fileLogger.info(message);
    consoleLogger.info(message);

    return {
      success: true,
      conversions: conversionsMap
    }
  }

  public getServiceEndpoint(): string {
    return this.serviceEndpoint;
  }

  public getRates() {
    return this.rates;
  }

}
