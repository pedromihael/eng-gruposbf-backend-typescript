import { Response } from '../types/response';

export class ResponseBuilder {
  private responseData: Response;

  constructor() {
    this.responseData = {
      status: 500,
      response: {},
    };
  }

  public setStatus(status: number) {
    this.responseData.status = status;
    return this;
  }

  public setResponse(response: any) {
    this.responseData.response = response;
    return this;
  }

  public build() {
    return this.responseData;
  }
}
