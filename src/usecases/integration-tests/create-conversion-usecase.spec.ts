import 'reflect-metadata';
import { CreateConversionUseCase } from '../create-conversion-usecase'
import { CurrenciesFakeRepository } from '../../interface-adapters/gateways/repositories/fake/currencies.repository'
import { IRepository } from '../../entities/protocols/repository.interface';
import { Currency } from '../../entities/core/currency';
import { uuid } from 'uuidv4';
import { constants } from '../../entities/constants';

let createConversionUseCase;
let fakeRepository: IRepository<Currency>;

describe('CreateConversionUseCase', () => {
  beforeAll(() => {
    fakeRepository = new CurrenciesFakeRepository();
  });

  beforeEach(() => {
    createConversionUseCase = new CreateConversionUseCase(fakeRepository);
  });

  it('should create a currency object if body is valid', async () => {
    const id = uuid();
    const body = {
      id,
      code: "CAD",
      active: true,
    };
    
    const result = await createConversionUseCase.execute(body);

    const expectedResult = {
      status: 200,
      response: body,
    }

    expect(result).toEqual(expectedResult);
  });

  it('should not create a currency object if body is invalid', async () => {
    const partialExpectedResultObject = {
      status: 400,
    }
    
    const body2 = {
      code: 999,
      active: true,
    };

    const body3 = {
      code: "Bitcoin",
      active: true,
    };
    
    const body4 = {
      code: "BRL",
      active: "true",
    };
    
    const expectedResult1 = {
      ...partialExpectedResultObject,
      response: { message: constants.errors.userErrors.MISSING_REQUEST_BODY}
    };

    const expectedResult2 = {
      ...partialExpectedResultObject,
      response: { message: `${constants.errors.userErrors.WRONG_PARAM_TYPE}: 'code' expected to be string - received number`}
    };

    const expectedResult3 = {
      ...partialExpectedResultObject,
      response: { message: constants.errors.userErrors.CODE_NOT_SUPPORTED}
    };

    const expectedResult4 = {
      ...partialExpectedResultObject,
      response: { message: `${constants.errors.userErrors.WRONG_PARAM_TYPE}: 'active' expected to be boolean - received string`}
    };
    
    const result1 = await createConversionUseCase.execute(null);
    expect(result1).toEqual(expectedResult1);
    
    const result2 = await createConversionUseCase.execute(body2);
    expect(result2).toEqual(expectedResult2);
    
    const result3 = await createConversionUseCase.execute(body3);
    expect(result3).toEqual(expectedResult3);
    
    const result4 = await createConversionUseCase.execute(body4);
    expect(result4).toEqual(expectedResult4);    
  });
  
});