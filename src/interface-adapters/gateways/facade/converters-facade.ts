import { autoInjectable, inject } from 'tsyringe';
import { IConversionsServiceAdapter } from '../adapters/conversion-services-adapter.interface';
import { IConversionsServiceFacade } from './converters-facade.interface';
import { GetConversionsRequestBody } from '../../../entities/custom-types/get-conversions-request-body.d'
import { Currency } from '../../../entities/core/currency';
import { IRepository } from '../../../entities/protocols/repository.interface';
import { RedisCacheAdapter } from '../adapters/redis-cache-adapter';

@autoInjectable()
export class ConvertersFacade implements IConversionsServiceFacade {
  // Aqui a injeção dos adaptadores é pela inversão de dependências
  // para possibilitar o uso de um teste com mock
  // e não pela regra de passagem de dados por camadas

  private redisAdapter: RedisCacheAdapter;

  constructor(
    @inject('ConvertersAdapters')
    private adapters: IConversionsServiceAdapter[],
    @inject('CurrenciesRepository')
    private repository: IRepository<Currency>,
  ) {
    this.redisAdapter = new RedisCacheAdapter();
  }

  private async getCurrenciesFromDatabase() {
    const currencies = await this.repository.list();
    const activeCurrencies = currencies?.filter(item => item.active);
    const codes = activeCurrencies?.map(item => { return item.code });

    return codes.length ? codes : ['USD', 'EUR', 'INR', 'BRL'];
  }

  public async getConversions({ baseCurrency = 'BRL', value }: GetConversionsRequestBody, shouldFail?: boolean) {
    const currenciesToConvert = await this.getCurrenciesFromDatabase();

    if (process.env.NODE_ENV !== 'test') {
      return await this.cacheStrategy(baseCurrency, value, currenciesToConvert);
    }

    return await this.adaptersStrategy(baseCurrency, value, currenciesToConvert, shouldFail);
  }

  private async adaptersStrategy(baseCurrency, value, currenciesToConvert, shouldFail = false) {
    let serviceEndpoint = '';
    let data: any = null;
    let conversions = {
      success: false,
    };

    for (const adapter of this.adapters) {      
      data = await (adapter as IConversionsServiceAdapter).convertValue({ baseCurrency, value }, currenciesToConvert, shouldFail);
      conversions = data;
      
      if (data.success) {
        serviceEndpoint = (adapter as IConversionsServiceAdapter).getServiceEndpoint();
        
        if (process.env.NODE_ENV !== 'test') {
          const rates = (adapter as IConversionsServiceAdapter).getRates();
          await this.redisAdapter.cacheRates(rates);
        }

        break;
      }
    }

    return { conversions, serviceEndpoint };
  }

  private async cacheStrategy(baseCurrency, value, currenciesToConvert) {
    const cached = await this.redisAdapter.convertValue({ baseCurrency, value }, currenciesToConvert);

    if (!cached?.success) {
      return await this.adaptersStrategy(baseCurrency, value, currenciesToConvert);
    }

    const serviceEndpoint = this.redisAdapter.getServiceEndpoint();

    return { 
      conversions: {
        success: true,
        conversions: cached?.conversions
      },
      serviceEndpoint
    };
  }
}
