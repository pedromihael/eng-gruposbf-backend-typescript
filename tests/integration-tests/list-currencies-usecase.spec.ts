import 'reflect-metadata';
import { CreateCurrencyUseCase } from '../../src/usecases/create-currency-usecase';
import { CurrenciesFakeRepository } from '../../src/interface-adapters/gateways/repositories/fake/currencies.repository';
import { IRepository } from '../../src/entities/protocols/repository.interface';
import { Currency } from '../../src/entities/core/currency';
import { constants } from '../../src/entities/constants/index';
import { uuid } from 'uuidv4';
import { ListCurrenciesUseCase } from '../../src/usecases/list-currencies-usecase';

let createCurrencyUseCase;
let listCurrenciesUseCase;
let fakeRepository: IRepository<Currency>;

describe('ListCurrenciesUseCase', () => {
  beforeEach(() => {
    fakeRepository = new CurrenciesFakeRepository();
    createCurrencyUseCase = new CreateCurrencyUseCase(fakeRepository);
    listCurrenciesUseCase = new ListCurrenciesUseCase(fakeRepository);
  });

  it('should list all stored currencies if there is any', async () => {
    const currencies = [
      {
        code: "CAD",
        active: true,
      },
      {
        code: "SEK",
        active: true,
      },
      {
        code: "ISK",
        active: false,
      }
    ];
    
    currencies.forEach(async currency => {
      await createCurrencyUseCase.execute(currency);
    });

    const expectedResults = {
      status: 200,
      response: currencies,
    };

    const result = await listCurrenciesUseCase.execute();

    expect(result).toEqual(expectedResults);
  });

  it('should return an array with [usd, eur, inr] if there is no currencies stored', async () => {
    const response = [
      { code: 'USD', active: true },
      { code: 'EUR', active: true },
      { code: 'INR', active: true },
    ];

    const expectedResults = {
      status: 200,
      response,
    };

    const result = await listCurrenciesUseCase.execute();

    expect(result).toEqual(expectedResults);
  });
  
});