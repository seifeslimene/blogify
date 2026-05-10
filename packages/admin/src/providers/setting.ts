import { httpProvider } from './http';

export class SettingProvider {
  /**
   * Get Settings
   */
  static async getSetting(): Promise<ISetting> {
    return httpProvider.post('/setting/get');
  }

  /**
   * Update Settings
   */
  static async updateSetting(data): Promise<ISetting> {
    return httpProvider.post(`/setting`, data);
  }
}
