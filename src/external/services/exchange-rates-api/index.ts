import fetch from 'node-fetch'

export class ExchangeRatesAPI {
  public async getCurrencies(baseCurrency = 'BRL') {    
    const endpoint = `https://open.er-api.com/v6/latest/${baseCurrency}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    return {
      data,
      endpoint
    };
  }
}
