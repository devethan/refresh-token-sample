import {HttpErrorCodeEnum} from './errorCodes.ts';

export default class HttpError extends Error {
  public readonly status: number;
  public readonly code: HttpErrorCodeEnum;

  constructor(status: number, code: HttpErrorCodeEnum, message: string) {
    super(message);
    this.status = status;
    this.code = code;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
