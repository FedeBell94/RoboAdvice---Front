export class GenericResponse {

  constructor(response?: number, errorCode?: number, errorString?: string, data?: any) {
    this.response = response;
    this.errorCode = errorCode;
    this.errorString = errorString;
    this.data = data;
  }
  data: any;
  response: number;
  errorCode: number;
  errorString: string;
}
