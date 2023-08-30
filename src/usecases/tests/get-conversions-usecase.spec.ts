import 'reflect-metadata';
import { ConversionMockAPIAdapter } from '../../interface-adapters/gateways/adapters/mock/conversion-mock-api-adapter';
import { GetConversionsRequestBody } from '../../entities/types/get-conversions-request-body.d'
import { GetConversionsUseCase } from '../get-conversions-usecase'
import { ConvertersFacade } from '../../interface-adapters/gateways/facade/converters-facade'

let convertersMockAdapter;
let convertersFacade;
let getConversionsUseCase;

describe('GetConversionsUseCase', () => {
  beforeEach(() => {
    convertersMockAdapter = new ConversionMockAPIAdapter();
    convertersFacade = new ConvertersFacade([convertersMockAdapter]);
    getConversionsUseCase = new GetConversionsUseCase(convertersFacade);
  });

  it('should return a list of conversions of a given numerical amount', async () => {
    const body: GetConversionsRequestBody = {
      value: 999
    };
    
    const result = await getConversionsUseCase.execute(body);

    expect(result).not.toBe([]);
  });

  // it('should return an error message if the input to convert is not numerical', async () => {});
  
  // it('should return an error message if the service is down', async () => {});
});