import 'reflect-metadata';
import { container } from 'tsyringe';
import { IConverterServicesFacade } from '../../gateways/facade/IConverterServicesFacade';
import { ConvertersFacade } from '../../gateways/facade/ConvertersFacade';

container.registerSingleton<IConverterServicesFacade>('ConvertersFacade', ConvertersFacade);
