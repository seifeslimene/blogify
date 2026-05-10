import { httpProvider } from './http';

export class SMTPProvider {
  /**
   * Upload Files
   * @param file
   */
  static async testSendMail(user): Promise<IFile> {
    return httpProvider.post('/smtp', {
      to: user,
      subject: 'Test',
      text: 'Test Email',
    });
  }
}
