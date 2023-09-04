import Redis from "ioredis";
import { promisify } from "util";
import { hasBeenMoreThanOneHour } from './helpers';
import * as dotenv from 'dotenv';
dotenv.config();

type ResponseParams = {
  success: boolean,
  rates: any
}

// Armazena currency rates baseados em BRL
export class RedisCacheService {
  private readonly redisClient;

  constructor() {
    this.redisClient = new Redis(process.env.REDIS_HOST||"redis://localhost:6379");
  }

  private get(key: string) {
    const syncRedisGet = promisify(this.redisClient.get).bind(this.redisClient);
    return syncRedisGet(key);
  }

  public async getCurrencies(currencies) {    
    const endpoint = 'In-memory cache';
    const response: ResponseParams = {
      success: false,
      rates: null,
    };

    for (const currency of currencies) {
      const rate = await this.get(`${currency}-rate`);
      const updatedAt = await this.get(`${currency}-updatedAt`);
     
      if (!rate || !updatedAt) {
        break;
      } 

      if (updatedAt && hasBeenMoreThanOneHour(new Date(updatedAt))) {
        break;
      }

      response.rates = {
        ...response.rates,
        [currency]: parseFloat(rate)
      };
      response.success = true;
    }

    return {
      data: response,
      endpoint
    };
  }  

  public setPair(key: string, value: string) {
    const syncRedisSet = promisify(this.redisClient.set).bind(this.redisClient);
    return syncRedisSet(key, value);
  }

  public getClient() {
    return this.redisClient;
  }
}