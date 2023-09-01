import { GetConversionsUseCase } from '../../usecases/get-conversions-usecase';
import { ConvertersFacade } from '../../interface-adapters/gateways/facade/converters-facade';
import { GetConversionsRequestBody } from '../../entities/types/get-conversions-request-body.d'
import { ExchangeRatesAPIAdapter } from '../../interface-adapters/gateways/adapters/exchange-rates-api-adapter';

// A fachada é injetada no construtor do use case porque, junto com os adaptadores,
// se encaixa como um gateway para os serviços externos utilizados no core da aplicaçao
// trazendo a inforção de fora para dentro.
// (serviços externos > gateways/controllers > use cases)
export const ConvertCurrencyController = async (body: GetConversionsRequestBody) => {
  const getConversionsUseCase = new GetConversionsUseCase(new ConvertersFacade([new ExchangeRatesAPIAdapter()]));
  const { baseCurrency, value} = body;

  return getConversionsUseCase.execute({ baseCurrency, value });
};