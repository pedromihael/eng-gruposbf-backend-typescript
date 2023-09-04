import { IConversionsServiceAdapter } from './conversion-services-adapter.interface';
import { FixerIOAPI } from '../../../external/services/fixer-io';
import { GetConversionsRequestBody } from '../../../entities/custom-types/get-conversions-request-body.d'
import { autoInjectable, inject } from 'tsyringe';
import { IRepository } from '../../../entities/protocols/repository.interface';
import { Currency } from '../../../entities/core/currency';
import { fileLogger, consoleLogger } from '../../../shared/logs/index';

@autoInjectable()
export class FixerIOAdapter implements IConversionsServiceAdapter {
  private converter!: FixerIOAPI;
  private serviceEndpoint: string;
  private rates: any[];

  constructor() {
    this.converter = new FixerIOAPI();
    this.serviceEndpoint = '';
    this.rates = [];
  }

  public async convertValue({ baseCurrency = 'BRL', value }: GetConversionsRequestBody, currencies: string[]): Promise<any> {
    const { data, endpoint } = await this.converter.getCurrencies();

    this.serviceEndpoint = endpoint;
    
    const convertTo = currencies.filter(c => c !== (baseCurrency));

    if (!data.success) {
      return { success: false, error: data?.error?.info }
    }

    const rateBRL = data.rates['BRL'];
    const valueInEuro = value/rateBRL;

    const keys = Object.keys(data.rates);
    const values = Object.values(data.rates);

    for (const [key, value] of Object.entries(data.rates)) {
      this.rates.push({ currency: key, value: parseFloat((rateBRL/parseFloat(`${value}`) || 1).toFixed(2)) })
    }

    const conversionsMap = {}

    convertTo.forEach(currency => {
      Object.assign(conversionsMap, { [currency]: parseFloat((valueInEuro*data.rates[currency]).toFixed(2)) })
    });

    const message = `POST /api/converter - Fixer IO Response: ${JSON.stringify(conversionsMap)}`
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

  public getRates(): any[] {
    return this.rates;
  }

}
