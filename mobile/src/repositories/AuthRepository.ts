import {HttpClient} from '../libs/api';
import LocalStorage from '../libs/localStorage';

export class AuthRepository extends HttpClient {
  public static signIn = '/sign-in';
  public static refreshToken = '/refresh-token';

  public async signIn() {
    const response = await this.instance.post<{
      accessToken: string;
      refreshToken: string;
    }>(AuthRepository.signIn);

    await LocalStorage.setAccessToken(response.data.accessToken);
    await LocalStorage.setRefreshToken(response.data.refreshToken);

    return;
  }

  public async signOut() {
    await LocalStorage.removeAccessToken();
    await LocalStorage.removeRefreshToken();
    return;
  }

  public async refreshAccessToken() {
    const refreshToken = await LocalStorage.getRefreshToken();

    if (!refreshToken) throw new Error('Refresh token is not exist');

    const response = await this.instance.post<{accessToken: string}>(
      AuthRepository.refreshToken,
      {
        refreshToken,
      },
    );

    const newAccessToken = response.data.accessToken;
    await LocalStorage.setAccessToken(newAccessToken);

    return newAccessToken;
  }
}
