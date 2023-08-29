import { Response } from '../types/Response';

export class ResponseBuilder {
  private responseData: Response;

  constructor() {
    this.responseData = {
      status: 500,
      route: '/',
      response: {},
    };
  }

  public setStatus(status: number) {
    this.responseData.status = status;
    return this;
  }

  public setRoute(route: string) {
    this.responseData.route = route;
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
