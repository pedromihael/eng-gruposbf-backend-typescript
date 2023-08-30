import { GetConversionsRequestBody } from '../../entities/types/get-conversions-request-body.d'

export interface IConverterServicesFacade {
  getConversions(getConversionsRequestBody: GetConversionsRequestBody): any
}
