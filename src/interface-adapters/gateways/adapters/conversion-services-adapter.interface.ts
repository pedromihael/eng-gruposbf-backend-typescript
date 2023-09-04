import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'
import { IRepository } from '../../../entities/protocols/repository.interface';

export interface IConversionsServiceAdapter {
  convertValue(getConversionsRequestBody: GetConversionsRequestBody, currencies: string[], shouldFail?: boolean): Promise<any>;
  getServiceEndpoint(): string;
  getRates(): any[];
}
