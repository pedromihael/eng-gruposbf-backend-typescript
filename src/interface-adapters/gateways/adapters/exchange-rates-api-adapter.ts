import { IConversionsServiceAdapter } from './conversion-services-adapter.interface';
import { ExchangeRatesAPI } from '../../../external/services/exchange-rates-api';
import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'

// TODO: interface para adapters (diferente de interface para fachadas)
export class ExchangeRatesAPIAdapter implements IConversionsServiceAdapter {
  private converter!: ExchangeRatesAPI;

  constructor() {
    this.converter = new ExchangeRatesAPI();
  }

  // todos os serviços devem ter um adaptador que responda por essa assinatura
  // para padronizar as chamadas dentro da fachada
  public async convertValue({ baseCurrency = 'BRL', value }: GetConversionsRequestBody) {
    const data = await this.converter.getCurrencies(baseCurrency);
    const convertTo = ['USD', 'EUR', 'INR', 'BRL'].filter(c => c !== (baseCurrency));

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
