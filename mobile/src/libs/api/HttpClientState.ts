type PendingRequestType = {
  resolve(token: string): void;
  reject(error: any): void;
};

class HttpClientState {
  private static instance: HttpClientState;
  // A flag for showing status of refreshing access token
  public isRefreshingAccessToken: boolean = false;
  // Failed requests due to access token expiration
  public pendingRequests: Array<PendingRequestType> = [];

  constructor() {}

  public static getInstance(): HttpClientState {
    if (!HttpClientState.instance) {
      HttpClientState.instance = new HttpClientState();
    }
    return HttpClientState.instance;
  }
}

export default HttpClientState.getInstance();
