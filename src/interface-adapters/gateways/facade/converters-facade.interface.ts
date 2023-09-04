import { GetConversionsRequestBody } from '../../../entities/custom-types/get-conversions-request-body';

export interface IConversionsServiceFacade {
  getConversions(getConversionsRequestBody: GetConversionsRequestBody, shouldFail?: boolean): any
}
