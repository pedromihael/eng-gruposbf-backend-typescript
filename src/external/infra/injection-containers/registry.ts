import 'reflect-metadata';
import { container } from 'tsyringe';

import { IConversionsServiceFacade } from '../../../interface-adapters/gateways/facade/converters-facade.interface';
import { ConvertersFacade } from '../../../interface-adapters/gateways/facade/converters-facade';

import { IConversionsServiceAdapter } from '../../../interface-adapters/gateways/adapters/conversion-services-adapter.interface';
import { ExchangeRatesAPIAdapter } from '../../../interface-adapters/gateways/adapters/exchange-rates-api-adapter';

import { Currency } from '../../../entities/core/currency';
import { IRepository } from '../../../entities/protocols/repository.interface';
import { CurrenciesMongoRepository } from '../../../interface-adapters/gateways/repositories/mongo/currencies.repository';

container.registerSingleton<IConversionsServiceFacade>('ConvertersFacade', ConvertersFacade);
container.registerSingleton<IConversionsServiceAdapter>('ConvertersAdapters', ExchangeRatesAPIAdapter);
container.registerSingleton<IRepository<Currency>>('CurrenciesRepository', CurrenciesMongoRepository);
