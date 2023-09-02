import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'
import { IRepository } from '../../../entities/protocols/repository.interface';
import { Currency } from '../../../entities/core/currency';

export type IConversionsServiceAdapter = {
  convertValue(getConversionsRequestBody: GetConversionsRequestBody, repository: IRepository<Currency>, shouldFail?: boolean): Promise<any>
  getServiceEndpoint(): string
}
