import 'reflect-metadata';
import { ConversionMockAPIAdapter } from '../../src/interface-adapters/gateways/adapters/mock/conversion-mock-api-adapter';
import { GetConversionsRequestBody } from '../../src/entities/custom-types/get-conversions-request-body';
import { GetConversionsUseCase } from '../../src/usecases/get-conversions-usecase';
import { ConvertersFacade } from '../../src/interface-adapters/gateways/facade/converters-facade';
import { constants } from '../../src/entities/constants/index';
import { CurrenciesFakeRepository } from '../../src/interface-adapters/gateways/repositories/fake/currencies.repository';
import { IRepository } from '../../src/entities/protocols/repository.interface';
import { Currency } from '../../src/entities/core/currency';
import { RedisCacheService } from '../../src/external/services/redis/index';

let CreateCurrencyUseCase;
let fakeRepository: IRepository<Currency>;

let convertersMockAdapter;
let convertersFacade;
let getConversionsUseCase;
const SHOULD_FAIL = true;

describe('GetConversionsUseCase', () => {
  beforeAll(() => {
    fakeRepository = new CurrenciesFakeRepository();
  });
  beforeEach(() => {
    convertersMockAdapter = new ConversionMockAPIAdapter();
    convertersFacade = new ConvertersFacade([convertersMockAdapter], fakeRepository);
    getConversionsUseCase = new GetConversionsUseCase(convertersFacade);
  });

  it('should return a list of conversions of a given numerical amount', async () => {
    const body = {
      value: 999
    };
    
    const result = await getConversionsUseCase.execute(body);
    console.log('result', result)
  
    const expectedResult = {
      status: 200,
      response: {
        EUR: 5264.73,
        INR: 58.94,
        USD: 4865.13,
      },
    }

    expect(expectedResult).toEqual(expectedResult);
  });

  it('should return an error message if the input to convert is not numerical', async () => {
    const body = {
      value: "999"
    };
    
    const result = await getConversionsUseCase.execute(body as unknown as GetConversionsRequestBody, SHOULD_FAIL);
  
    const expectedResult = {
      status: 418,
      response: {
        message: constants.errors.userErrors.NON_NUMERICAL_VALUE
      },
    }

    expect(result).toEqual(expectedResult);
  });
  
  it('should return an error message if the service is down', async () => {
    const body = {
      value: 999
    };
    
    const result = await getConversionsUseCase.execute(body, SHOULD_FAIL);
  
    const expectedResult = {
      status: 503,
      response: {
        message: constants.errors.serverErrors.EXTERNAL_SERVICE_DOWN,
      },
    }

    expect(result).toEqual(expectedResult);
  });

  it('should return an error message if the input body has not `value` field', async () => {
    const body = {
      invalid: 'body'
    };
    
    const result = await getConversionsUseCase.execute(body as unknown as GetConversionsRequestBody);
  
    const expectedResult = {
      status: 422,
      response: {
        message: constants.errors.userErrors.MISSING_VALUE_OR_BASE_CURRENCY
      },
    }

    expect(result).toEqual(expectedResult);
  });

  it('should return an error message if the input body has wrong `baseCurrency` field', async () => {
    const body = {
      value: 999,
      baseCurrency: 888
    };
    
    const result = await getConversionsUseCase.execute(body as unknown as GetConversionsRequestBody);
  
    const expectedResult = {
      status: 422,
      response: {
        message: constants.errors.userErrors.MISSING_VALUE_OR_BASE_CURRENCY
      },
    }

    expect(result).toEqual(expectedResult);
  });

  it('should return an error message if the input body has invalid `baseCurrency` field', async () => {
    const body = {
      value: 999,
      baseCurrency: 888
    };
    
    const result = await getConversionsUseCase.execute(body as unknown as GetConversionsRequestBody);
  
    const expectedResult = {
      status: 422,
    }

    expect(result.status).toEqual(422);
  });
});