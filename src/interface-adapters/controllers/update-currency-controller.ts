import { CreateConversionUseCase } from '../../usecases/create-conversion-usecase';
import { ConvertersFacade } from '../../interface-adapters/gateways/facade/converters-facade';
import { Currency } from '../../entities/core/currency'
import { CurrenciesMongoRepository } from '../gateways/repositories/mongo/currencies.repository';
import { UpdateCurrencyUseCase } from '../../usecases/update-currency-usecase';

export const UpdateCurrencyController = async (body: Partial<Currency>) => {
  const updateCurrencyUseCase = new UpdateCurrencyUseCase(new CurrenciesMongoRepository());
  return updateCurrencyUseCase.execute(body);
};
