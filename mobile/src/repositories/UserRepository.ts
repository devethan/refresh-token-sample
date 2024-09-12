import {HttpClient} from '../libs/api';

export class UserRepository extends HttpClient {
  public static me = '/me';
  public static test1 = '/test1';
  public static test2 = '/test2';
  public static test3 = '/test3';

  public async fetchProfile() {
    const response = await this.instance.get(UserRepository.me);
    return response.data;
  }

  public async fetchTest1() {
    const response = await this.instance.get(UserRepository.test1);
    return response.data;
  }

  public async fetchTest2() {
    const response = await this.instance.get(UserRepository.test2);
    return response.data;
  }

  public async fetchTest3() {
    const response = await this.instance.get(UserRepository.test3);
    return response.data;
  }
}
