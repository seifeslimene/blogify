import { httpProvider } from './http';

export class KnowledgeProvider {
  /**
   * Create Knowledge Base
   * @param data
   */
  static createBook(data): Promise<IKnowledge> {
    return httpProvider.post('/knowledge/book', data);
  }

  /**
   * Create Knowledge Base Chapters
   * @param data
   */
  static createChapters(data): Promise<Array<IKnowledge>> {
    return httpProvider.post('/knowledge/chapter', data);
  }

  /**
   * Delete Article
   * @param id
   */
  static async deleteKnowledge(id): Promise<IKnowledge> {
    return httpProvider.delete(`/knowledge/${id}`);
  }

  /**
   * Update Article
   * @param id
   * @param data
   */
  static async updateKnowledge(id, data): Promise<IKnowledge> {
    return httpProvider.patch(`/knowledge/${id}`, data);
  }

  /**
   * Get All Knowledge Bases (Excluding Chapters)
   */
  static async getKnowledges(params = {}): Promise<[IKnowledge[], number]> {
    return httpProvider.get('/knowledge', { params });
  }

  /**
   * Get Knowledge Details (If It Is A Knowledge Base, Including All Chapters)
   * @param id
   */
  static async getKnowledge(id): Promise<IKnowledge> {
    return httpProvider.get(`/knowledge/${id}`);
  }

  /**
   * Update Knowledge Reading Volume
   * @param id
   * @param data
   */
  static async updateKnowledgeViews(id): Promise<IKnowledge> {
    return httpProvider.post(`/knowledge/${id}/views`);
  }

  /**
   * Update The Number Of Knowledge Likes
   * @param id
   * @param data
   */
  static async updateKnowledgeLikes(id, type): Promise<IKnowledge> {
    return httpProvider.post(`/knowledge/${id}/likes`, { type });
  }
}
