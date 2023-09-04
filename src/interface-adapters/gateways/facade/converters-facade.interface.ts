import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body';

export interface IConversionsServiceFacade {
  getConversions(getConversionsRequestBody: GetConversionsRequestBody, shouldFail?: boolean): any
}
