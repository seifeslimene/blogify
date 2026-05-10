import { httpProvider } from './http';

export class PageProvider {
  /**
   * Get All Pages
   */
  static async getPages(params): Promise<[IPage[], number]> {
    return httpProvider.get('/page', { params: params });
  }

  /**
   * Get All Published Pages
   */
  static async getAllPublisedPages(): Promise<[IPage[], number]> {
    return httpProvider.get('/page', { params: { status: 'publish' } }).then((res) => {
      return [res[0].sort((a, b) => -a.order + b.order), res[1]];
    });
  }

  /**
   * Get The Specified Page
   * @param id
   */
  static async getPage(id): Promise<IPage> {
    return httpProvider.get(`/page/${id}`);
  }

  /**
   * Create New Page
   * @param data
   */
  static async addPage(data): Promise<IPage> {
    return httpProvider.post('/page', data);
  }

  /**
   * Update Page
   * @param id
   * @param data
   */
  static async updatePage(id, data): Promise<IPage> {
    return httpProvider.patch(`/page/${id}`, data);
  }

  /**
   * Update Article Reading Volume
   * @param id
   * @param data
   */
  static async updatePageViews(id): Promise<IPage> {
    return httpProvider.post(`/page/${id}/views`);
  }

  /**
   * Delete Page
   * @param id
   */
  static async deletePage(id): Promise<IPage> {
    return httpProvider.delete(`/page/${id}`);
  }
}
