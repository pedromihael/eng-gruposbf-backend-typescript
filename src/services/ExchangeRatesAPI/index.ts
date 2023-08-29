import fetch from 'node-fetch'

export class ExchangeRatesAPI {
  public async getCurrencies(baseCurrency = 'BRL') {    
    const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
    const data = await response.json();

    return data;
  }
}
