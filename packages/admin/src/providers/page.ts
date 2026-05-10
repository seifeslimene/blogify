import * as Showdown from 'showdown';

import { httpProvider } from './http';

const converter = new Showdown.Converter({
  tables: true,
  simplifiedAutoLink: true,
  strikethrough: true,
  tasklists: true,
  emoji: true,
});

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
  static async getAllPublishedPages(): Promise<[IPage[], number]> {
    return httpProvider.get('/page', { params: { status: 'publish' } });
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
    data.html = converter.makeHtml(data.content);
    return httpProvider.post('/page', data);
  }

  /**
   * Update Page
   * @param id
   * @param data
   */
  static async updatePage(id, data): Promise<IPage> {
    data.html = converter.makeHtml(data.content);
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
