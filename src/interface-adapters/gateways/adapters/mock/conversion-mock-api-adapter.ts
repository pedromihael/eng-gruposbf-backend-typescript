import { IConversionsServiceAdapter } from '../conversion-services-adapter.interface';
import { GetConversionsRequestBody } from '../../../../entities/types/get-conversions-request-body.d'

export class ConversionMockAPIAdapter implements IConversionsServiceAdapter {
  constructor() {}

  public async convertValue({ baseCurrency = 'BRL', value }: GetConversionsRequestBody, shouldFail?: boolean) {
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

    return {
      success: true,
      conversions: conversionsMap
    }
  }

  private failOnPurpose() {
    return {
      success: false,
    }
  }

}
