import { GetConversionsUseCase } from '../useCases/GetConversionsUseCase';
import { ConvertersFacade } from '../gateways/facade/ConvertersFacade';
import { GetConversionsRequestBody } from '../entities/types/GetConversionsRequestBody'

export const ConvertCurrencyController = async (body: GetConversionsRequestBody) => {
  const getConversionsUseCase = new GetConversionsUseCase(new ConvertersFacade());
  const { baseCurrency, value} = body;

  return getConversionsUseCase.execute({ baseCurrency, value });
};
