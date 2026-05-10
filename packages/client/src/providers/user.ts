import { httpProvider } from './http';

export class UserProvider {
  /**
   * User Login
   * @param data
   */
  static async login(data): Promise<IUser> {
    return httpProvider.post('/auth/login', data);
  }

  static async loginWithGithub(code): Promise<IUser> {
    return httpProvider.post('/auth/github', { code });
  }

  /**
   * User Registration
   * @param data
   */
  static async register(data): Promise<IUser> {
    return httpProvider.post('/user/register', data);
  }

  /**
   * Get User
   * @param params
   */
  static getUsers(params): Promise<[IUser[], number]> {
    return httpProvider.get('/user', { params });
  }

  /**
   * Update User Information
   * @param data
   */
  static async update(data): Promise<IUser> {
    return httpProvider.post('/user/update', data);
  }

  /**
   * Update User Password
   * @param data
   */
  static async updatePassword(data): Promise<IUser> {
    return httpProvider.post('/user/password', data);
  }
}
