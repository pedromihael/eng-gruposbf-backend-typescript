import 'reflect-metadata';
import { container } from 'tsyringe';
import { IConverterServicesFacade } from '../../interface-adapters/gateways/facade/converters-facade.interface';
import { ConvertersFacade } from '../../interface-adapters/gateways/facade/converters-facade';

container.registerSingleton<IConverterServicesFacade>('ConvertersFacade', ConvertersFacade);
