import { httpProvider } from './http';

export class MailProvider {
  /**
   * Get All Emails
   */
  static async getMails(params): Promise<[IMail[], number]> {
    return httpProvider.get('/smtp', { params });
  }

  static async deleteMail(id): Promise<IMail> {
    return httpProvider.delete('/smtp/' + id);
  }
}
