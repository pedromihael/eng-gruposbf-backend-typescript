import { CreateConversionUseCase } from '../../usecases/create-conversion-usecase';
import { ConvertersFacade } from '../../interface-adapters/gateways/facade/converters-facade';
import { Currency } from '../../entities/core/currency'
import { CurrenciesMongoRepository } from '../gateways/repositories/mongo/currencies.repository';

export const CreateCurrencyController = async (body: Currency) => {
  const createCurrencyController = new CreateConversionUseCase(new CurrenciesMongoRepository());
  return createCurrencyController.execute(body);
};
