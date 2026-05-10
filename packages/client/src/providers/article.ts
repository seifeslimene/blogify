import { httpProvider } from './http';

export class ArticleProvider {
  /**
   * Get All Articles
   */
  static async getArticles(params): Promise<[IArticle[], number]> {
    return httpProvider.get('/article', { params });
  }

  /**
   * Get All Recommended Articles
   */
  static async getAllRecommendArticles(): Promise<IArticle[]> {
    return httpProvider.get('/article/all/recommend');
  }

  /**
   * Get All Articles In The Category
   * @param category
   * @param params
   */
  static async getArticlesByCategory(category, params): Promise<[IArticle[], number]> {
    return httpProvider.get('/article/category/' + category, { params });
  }

  /**
   * Get All Articles With Tags
   * @param tag
   * @param params
   */
  static async getArticlesByTag(tag, params): Promise<[IArticle[], number]> {
    return httpProvider.get('/article/tag/' + tag, { params });
  }

  /**
   * Get Recommended Articles
   * @param articleId
   */
  static async getRecommend(articleId = null): Promise<IArticle[]> {
    return httpProvider.get('/article/recommend', { params: { articleId } });
  }

  /**
   * Get All Article Archives
   */
  static async getArchives(): Promise<{
    [key: string]: { [key: string]: IArticle[] };
  }> {
    return httpProvider.get('/article/archives');
  }

  /**
   * Get The Specified Article
   * @param id
   */
  static async getArticle(id): Promise<IArticle> {
    return httpProvider.get(`/article/${id}`);
  }

  /**
   * Create New Article
   * @param data
   */
  static async addArticle(data): Promise<IArticle> {
    return httpProvider.post('/article', data);
  }

  /**
   * Update Article
   * @param id
   * @param data
   */
  static async updateArticle(id, data): Promise<IArticle> {
    return httpProvider.patch(`/article/${id}`, data);
  }

  /**
   * Update Article Reading Volume
   * @param id
   * @param data
   */
  static async updateArticleViews(id): Promise<IArticle> {
    return httpProvider.post(`/article/${id}/views`);
  }

  /**
   * Update Article Like Count
   * @param id
   * @param data
   */
  static async updateArticleLikes(id, type): Promise<IArticle> {
    return httpProvider.post(`/article/${id}/likes`, { type });
  }

  /**
   * Verify Whether The Article Password Is Correct
   * @param id
   * @param password
   */
  static async checkPassword(id, password): Promise<{ pass: boolean } & IArticle> {
    return httpProvider.post(`/article/${id}/checkPassword`, { password });
  }

  /**
   * Delete Article
   * @param id
   */
  static async deleteArticle(id): Promise<IArticle> {
    return httpProvider.delete(`/article/${id}`);
  }
}
