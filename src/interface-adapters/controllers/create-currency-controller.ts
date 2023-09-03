import { CreateCurrencyUseCase } from '../../usecases/create-currency-usecase';
import { ConvertersFacade } from '../../interface-adapters/gateways/facade/converters-facade';
import { Currency } from '../../entities/core/currency'
import { CurrenciesMongoRepository } from '../gateways/repositories/mongo/currencies.repository';

export const CreateCurrencyController = async (body: Currency) => {
  const createCurrencyController = new CreateCurrencyUseCase(new CurrenciesMongoRepository());
  return createCurrencyController.execute(body);
};
