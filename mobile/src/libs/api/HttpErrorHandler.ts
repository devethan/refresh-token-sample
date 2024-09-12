import HttpClientState from './HttpClientState.ts';
import HttpClient from './HttpClient.ts';
import {
  HttpAccessTokenExpiredError,
  HttpErrorCodeEnum,
  HttpInvalidAccessTokenError,
  HttpInvalidRefreshTokenError,
  HttpRefreshTokenExpiredError,
} from './errors';
import {AuthRepository} from '../../repositories';
import LocalStorage from '../localStorage';

export default class HttpErrorHandler {
  private static readonly httpState = HttpClientState;

  private static logging(message: string, type?: 'debug' | 'error') {
    console[type ?? 'debug'](`[${new Date().toISOString()}] ${message}`);
  }

  public static async handleResponseError(error: any, client: HttpClient) {
    const errorCode = error.response?.data.code ?? '';
    const method = error.config?.method?.toUpperCase() || 'UNKNOWN_METHOD';
    const url = error.config?.url || 'UNKNOWN_URL';
    const status = error.response?.status || 'NO_STATUS';
    const errorMessage =
      error.response?.data?.message || error.message || 'UNKNOWN_ERROR';
    this.logging(
      `🔴 [${method} ${url}] ${errorCode} (${status}) : ${errorMessage}`,
      'error',
    );
    switch (errorCode) {
      case HttpErrorCodeEnum.INVALID_ACCESS_TOKEN:
        return this.handleInvalidAccessToken();
      case HttpErrorCodeEnum.ACCESS_TOKEN_EXPIRED:
        return this.handleAccessTokenExpired(error, client);
      case HttpErrorCodeEnum.INVALID_REFRESH_TOKEN:
        return this.handleInvalidRefreshToken();
      case HttpErrorCodeEnum.REFRESH_TOKEN_EXPIRED:
        return this.handleRefreshTokenExpired();
      default:
        console.error('Undefined error has occurred');
        throw error;
    }
  }

  private static async handleInvalidAccessToken() {
    const accessToken = await LocalStorage.getAccessToken();

    if (!accessToken) throw new Error('Empty Access Token');

    this.logging('Remove an token due to its invalidation');
    await LocalStorage.removeAccessToken();
    throw new HttpInvalidAccessTokenError();
  }

  private static async handleAccessTokenExpired(
    responseError: any,
    client: HttpClient,
  ) {
    const api = client.getInstance();
    const originalRequest = responseError.config;

    // If any of the flags have been tried before, it is considered a failure.
    if (originalRequest._retry) throw new HttpAccessTokenExpiredError();

    if (this.httpState.isRefreshingAccessToken) {
      this.logging(
        'Push an request into pendingRequests queue during the process of refreshing token',
      );
      return new Promise((resolve, reject) => {
        this.httpState.pendingRequests.push({
          resolve,
          reject,
        });
      })
        .then(() => {
          this.logging(
            `[${originalRequest.method} ${originalRequest.url}] A pending request has resolved!`,
          );
          return api(originalRequest);
        })
        .catch(error => {
          throw error;
        });
    }

    this.logging(
      'Request refreshing token, and a stale access token will be removed',
    );
    this.httpState.isRefreshingAccessToken = true;
    originalRequest._retry = true;
    await LocalStorage.removeAccessToken();

    try {
      this.logging('Request a new Access Token');
      const newAccessToken = await new AuthRepository().refreshAccessToken();

      this.logging(
        `Resolve pending requests(${this.httpState.pendingRequests.length}) with a new Access Token`,
      );

      await Promise.all(
        this.httpState.pendingRequests.map(request =>
          request.resolve(newAccessToken),
        ),
      );

      this.logging('Re-try the first failed request');
      return api(originalRequest);
    } catch (error) {
      const errorCode = error?.constructor.name ?? 'UNKNOWN_ERROR';
      this.logging(
        `Failed to refresh access token with ${errorCode}. Reject all of pending requests(${this.httpState.pendingRequests.length})`,
        'error',
      );

      this.httpState.pendingRequests.map(request => request.reject(error));

      throw error;
    } finally {
      this.httpState.pendingRequests = [];
      this.httpState.isRefreshingAccessToken = false;
    }
  }

  private static async handleInvalidRefreshToken() {
    await LocalStorage.removeRefreshToken();
    throw new HttpInvalidRefreshTokenError();
  }

  private static async handleRefreshTokenExpired() {
    await LocalStorage.removeRefreshToken();
    throw new HttpRefreshTokenExpiredError();
  }
}
