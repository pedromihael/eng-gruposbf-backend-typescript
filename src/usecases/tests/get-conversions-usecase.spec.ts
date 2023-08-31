import 'reflect-metadata';
import { ConversionMockAPIAdapter } from '../../interface-adapters/gateways/adapters/mock/conversion-mock-api-adapter';
import { GetConversionsRequestBody } from '../../entities/types/get-conversions-request-body.d'
import { GetConversionsUseCase } from '../get-conversions-usecase'
import { ConvertersFacade } from '../../interface-adapters/gateways/facade/converters-facade'

let convertersMockAdapter;
let convertersFacade;
let getConversionsUseCase;
const SHOULD_FAIL = true;

describe('GetConversionsUseCase', () => {
  beforeEach(() => {
    convertersMockAdapter = new ConversionMockAPIAdapter();
    convertersFacade = new ConvertersFacade([convertersMockAdapter]);
    getConversionsUseCase = new GetConversionsUseCase(convertersFacade);
  });

  it('should return a list of conversions of a given numerical amount', async () => {
    const body = {
      value: 999
    };
    
    const result = await getConversionsUseCase.execute(body);
  
    const expectedResult = {
      route: "/api/converter",
      status: 200,
      response: {
        EUR: 5264.73,
        INR: 58.94,
        USD: 4865.13,
      },
    }

    expect(result).toEqual(expectedResult);
  });

  it('should return an error message if the input to convert is not numerical', async () => {
    const body = {
      value: "999"
    };
    
    const result = await getConversionsUseCase.execute(body as unknown as GetConversionsRequestBody, SHOULD_FAIL);
  
    const expectedResult = {
      route: "/api/converter",
      status: 418,
      response: {
        message: 'Input value is not a number.'
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
      route: "/api/converter",
      status: 503,
      response: {
        message: 'External Service is down.'
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
      route: "/api/converter",
      status: 422,
      response: {
        message: 'Invalid request body. Body should contain `value` numerical field. If body contains `baseCurrency` it should be a string.'
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
      route: "/api/converter",
      status: 422,
      response: {
        message: 'Invalid request body. Body should contain `value` numerical field. If body contains `baseCurrency` it should be a string.'
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
      route: "/api/converter",
      status: 422,
    }

    expect(result.status).toEqual(422);
  });
});