import HttpError from './HttpError';
import {HttpErrorCodeEnum} from './errorCodes.ts';

export {HttpErrorCodeEnum};

export class HttpAccessTokenExpiredError extends HttpError {
  constructor(message = 'The provided access token has expired.') {
    super(401, HttpErrorCodeEnum.ACCESS_TOKEN_EXPIRED, message);
  }
}

export class HttpInvalidAccessTokenError extends HttpError {
  constructor(
    message = 'The provided access token is invalid. Please authenticate again.',
  ) {
    super(401, HttpErrorCodeEnum.INVALID_ACCESS_TOKEN, message);
  }
}

export class HttpRefreshTokenExpiredError extends HttpError {
  constructor(message = 'The provided refresh token has expired.') {
    super(401, HttpErrorCodeEnum.REFRESH_TOKEN_EXPIRED, message);
  }
}

export class HttpInvalidRefreshTokenError extends HttpError {
  constructor(
    message = 'The provided refresh token is invalid. Please authenticate again.',
  ) {
    super(401, HttpErrorCodeEnum.INVALID_REFRESH_TOKEN, message);
  }
}
