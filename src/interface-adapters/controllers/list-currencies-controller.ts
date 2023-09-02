import { CurrenciesMongoRepository } from '../gateways/repositories/mongo/currencies.repository';
import { ListCurrenciesUseCase } from '../../usecases/list-currencies-usecase';

export const ListCurrenciesController = async () => {
  const listCurrenciesUseCase = new ListCurrenciesUseCase(new CurrenciesMongoRepository());
  return listCurrenciesUseCase.execute();
};
