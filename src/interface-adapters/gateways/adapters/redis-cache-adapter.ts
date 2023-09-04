import { IConversionsServiceAdapter } from './conversion-services-adapter.interface';
import { ExchangeRatesAPI } from '../../../external/services/exchange-rates-api';
import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'
import { autoInjectable, inject } from 'tsyringe';
import { IRepository } from '../../../entities/protocols/repository.interface';
import { Currency } from '../../../entities/core/currency';
import { RedisCacheService } from '../../../external/services/redis/index';
import { fileLogger, consoleLogger } from '../../../shared/logs/index';

@autoInjectable()
export class RedisCacheAdapter {
  private redis!: RedisCacheService;
  private serviceEndpoint: string;

  constructor() {
    this.redis = new RedisCacheService();
    this.serviceEndpoint = '';
  }

  public async convertValue({ baseCurrency = 'BRL', value }: GetConversionsRequestBody, currencies: string[]): Promise<any> {
    const { data, endpoint } = await this.redis.getCurrencies(currencies);

    this.serviceEndpoint = endpoint;
    
    const convertTo = currencies.filter(c => c !== (baseCurrency));

    if (!data.rates) {
      const message = 'POST /api/convert-currency - REDIS: No valid entries in cache'
      
      fileLogger.info(message);
      consoleLogger.info(message);
      
      return { success: false, error: 'No valid entries in cache.', conversions: [] }
    }

    const conversionsMap = {}

    convertTo.forEach(currency => {
      Object.assign(conversionsMap, { [currency]: parseFloat((value*data.rates[currency]).toFixed(2)) })
    });

    const message = `POST /api/converter - Cached Response: ${JSON.stringify(conversionsMap)}`
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

  public async cacheRates(rates): Promise<void> {
    const updatedAt = new Date().toISOString();

    for (const rate of rates) {
      await this.redis.setPair(`${rate.currency}-rate`, `${rate.value}`);
      await this.redis.setPair(`${rate.currency}-updatedAt`, updatedAt);
    }
  }

}
