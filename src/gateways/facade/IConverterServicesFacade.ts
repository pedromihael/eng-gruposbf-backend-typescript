import { GetConversionsRequestBody } from '../../entities/types/GetConversionsRequestBody'

export interface IConverterServicesFacade {
  getConversions(getConversionsRequestBody: GetConversionsRequestBody): any
}
