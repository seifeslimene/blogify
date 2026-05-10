import { httpProvider } from './http';

export class ViewProvider {
  /**
   * Get All Access
   */
  static async getViews(params): Promise<[IView[], number]> {
    return httpProvider.get('/view', { params });
  }

  /**
   * Add Access
   * @param data
   */
  static async addView(data): Promise<IView> {
    return httpProvider.post('/view', data);
  }

  static async getViewsByUrl(url): Promise<IView[]> {
    return httpProvider.get('/view/url', { params: { url } });
  }

  static async deleteView(id): Promise<IView> {
    return httpProvider.delete('/view/' + id);
  }
}
