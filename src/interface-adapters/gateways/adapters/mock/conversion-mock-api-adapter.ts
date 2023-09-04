import { IConversionsServiceAdapter } from '../conversion-services-adapter.interface';
import { GetConversionsRequestBody } from '../../../../entities/types/get-conversions-request-body.d'
import { IRepository } from '../../../../entities/protocols/repository.interface';
import { Currency } from '../../../../entities/core/currency';

export class ConversionMockAPIAdapter implements IConversionsServiceAdapter {
  private rates: any[];

  constructor() {
    this.rates = [];
  }

  public async convertValue({ baseCurrency = 'BRL', value }: GetConversionsRequestBody, currencies: string[], shouldFail?: boolean) {
    if (shouldFail) {
      return this.failOnPurpose();
    }
    
    const data = {
      rates: {
        'USD': 4.87,
        'EUR': 5.27,
        'INR': 0.059,
        'BRL': 1,
      }
    }

    const convertTo = ['USD', 'EUR', 'INR', 'BRL'].filter(c => c !== (baseCurrency));
    const conversionsMap = {}

    convertTo.forEach(currency => {
      Object.assign(conversionsMap, { [currency]: parseFloat((value*data.rates[currency]).toFixed(2)) })
    });

    this.rates = convertTo.map(currency => {
      return {
        currency,
        value: data.rates[currency]
      }
    });

    return {
      success: true,
      conversions: conversionsMap
    }
  }

  public getServiceEndpoint() {
    return 'mock';
  }

  public getRates() {
    return this.rates;
  }

  private failOnPurpose() {
    return {
      success: false,
    }
  }

}
