import { httpProvider } from './http';

export class TagProvider {
  /**
   * Get All Tags
   */
  static async getTags(): Promise<ITag[]> {
    return httpProvider.get('/tag');
  }

  /**
   * Get Articles Under Specified Tags
   * @param id
   */
  static async getTagWithArticles(id, needFilter = false): Promise<ITag> {
    return httpProvider.get(
      `/tag/${id}/article`,
      needFilter
        ? {
            params: { status: 'publish' },
          }
        : {}
    );
  }

  /**
   * Add Tag
   * @param data
   */
  static async addTag(data): Promise<ITag> {
    return httpProvider.post('/tag', data);
  }

  /**
   * Update Tags
   * @param id
   * @param data
   */
  static async updateTag(id, data): Promise<ITag> {
    return httpProvider.patch(`/tag/${id}`, data);
  }

  /**
   * Delete Tag
   * @param id
   */
  static async deleteTag(id): Promise<ITag> {
    return httpProvider.delete(`/tag/${id}`);
  }
}
