import { GetConversionsRequestBody } from '../../../entities/types/get-conversions-request-body.d'

export interface IConversionsServiceAdapter {
  convertValue(getConversionsRequestBody: GetConversionsRequestBody, shouldFail?: boolean): any
}