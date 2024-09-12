import AsyncStorage from '@react-native-async-storage/async-storage';

export default class LocalStorage {
  private static readonly accessToken = 'accessToken';
  private static readonly refreshToken = 'refreshToken';

  public static setAccessToken(token: string) {
    return AsyncStorage.setItem(LocalStorage.accessToken, token);
  }

  public static async getAccessToken() {
    return AsyncStorage.getItem(LocalStorage.accessToken);
  }

  public static removeAccessToken() {
    return AsyncStorage.removeItem(LocalStorage.accessToken);
  }

  public static setRefreshToken(token: string) {
    return AsyncStorage.setItem(LocalStorage.refreshToken, token);
  }

  public static async getRefreshToken() {
    return AsyncStorage.getItem(LocalStorage.refreshToken);
  }

  public static removeRefreshToken() {
    return AsyncStorage.removeItem(LocalStorage.refreshToken);
  }
}
