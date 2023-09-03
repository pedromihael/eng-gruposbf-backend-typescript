import 'reflect-metadata';
import { CreateCurrencyUseCase } from '../../src/usecases/create-currency-usecase';
import { CurrenciesFakeRepository } from '../../src/interface-adapters/gateways/repositories/fake/currencies.repository';
import { IRepository } from '../../src/entities/protocols/repository.interface';
import { Currency } from '../../src/entities/core/currency';
import { constants } from '../../src/entities/constants/index';
import { uuid } from 'uuidv4';
import { UpdateCurrencyUseCase } from '../../src/usecases/update-currency-usecase';

let createCurrencyUseCase;
let updateCurrenciesUseCase;
let fakeRepository: IRepository<Currency>;

describe('UpdateCurrencyUseCase', () => {
  beforeEach(() => {
    fakeRepository = new CurrenciesFakeRepository();
    createCurrencyUseCase = new CreateCurrencyUseCase(fakeRepository);
    updateCurrenciesUseCase = new UpdateCurrencyUseCase(fakeRepository);
  });

  it('should update a stored currency', async () => {
    const body = { code: "ISK", active: false }
    await createCurrencyUseCase.execute(body);

    const updated = { code: "ISK", active: true };
    const expectedResult = {
      status: 200,
      response: updated,
    };

    const result = await updateCurrenciesUseCase.execute(updated);
    expect(result).toEqual(expectedResult);
  });

  it('should not update if there is no related stored currency', async () => {
    const updated = { code: "ISK", active: true };
    const expectedResult = { status: 404, response: { message: 'Currency not found' } };

    const result = await updateCurrenciesUseCase.execute(updated);
    expect(result).toEqual(expectedResult);
  });
  
});