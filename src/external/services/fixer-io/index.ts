import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config();

// No plano gratuito, a moeda base desse serviço é o EURO
// e o protocolo HTTPS não é suportado.
export class FixerIOAPI {
  public async getCurrencies() {    
    const endpoint = `http://data.fixer.io/api/latest?access_key=${process.env.SERVICE_FIXER_IO_ACCESS_KEY}`;
    const response = await fetch(endpoint);
    const data = await response.json();

    return {
      data,
      endpoint
    };
  }
}
