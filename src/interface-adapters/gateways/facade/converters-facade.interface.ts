import { GetConversionsRequestBody } from '../../entities/types/get-conversions-request-body.d'

export interface IConversionsServiceFacade {
  getConversions(getConversionsRequestBody: GetConversionsRequestBody, shouldFail?: boolean): any
}
