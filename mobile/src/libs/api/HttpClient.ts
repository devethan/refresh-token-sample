import axios, {AxiosInstance} from 'axios';
import HttpErrorHandler from './HttpErrorHandler.ts';
import LocalStorage from '../localStorage';

export default class HttpClient {
  protected readonly instance: AxiosInstance;

  private logging(message: string) {
    console.debug(`[${new Date().toISOString()}] ${message}`);
  }

  constructor() {
    this.instance = axios.create({baseURL: 'http://localhost:4000/api'});
    this.instance.interceptors.request.use(
      async request => {
        // Add an Access Token into the header of the HTTP message
        const accessToken = await LocalStorage.getAccessToken();
        if (accessToken) {
          request.headers.Authorization = `Bearer ${accessToken}`;
        }
        this.logging(
          `🟠 [${request.method?.toUpperCase() ?? 'UNKNOWN'} ${request.url}] ${request.headers} ${JSON.stringify(request?.data ?? {}) ?? ''}`,
        );
        return request;
      },
      error => {},
    );
    this.instance.interceptors.response.use(
      response => {
        this.logging(
          `🟢 [${response.config.method?.toUpperCase() ?? 'UNKNOWN'} ${response.config.url}] ${response.config.headers}`,
        );
        return response;
      },
      error => HttpErrorHandler.handleResponseError(error, this),
    );
  }

  public getInstance() {
    return this.instance;
  }
}
