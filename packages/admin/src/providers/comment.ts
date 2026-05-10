import { httpProvider } from './http';

export class CommentProvider {
  /**
   * Get All Comments
   */
  static async getComments(params): Promise<[IComment[], number]> {
    return httpProvider.get('/comment', { params });
  }

  /**
   * Get Specified Comments
   * @param id
   */
  static async getComment(id): Promise<IComment> {
    return httpProvider.get(`/comment/${id}`);
  }

  /**
   * Get Comments On Specified Article
   * @param hostId
   */
  static async getArticleComments(hostId, params): Promise<[IComment[], number]> {
    return httpProvider.get(`/comment/host/${hostId}`, { params });
  }

  /**
   * Add Comment
   * @param data
   */
  static async addComment(data): Promise<IComment> {
    return httpProvider.post('/comment', data);
  }

  /**
   * Updated Comments
   * @param id
   * @param data
   */
  static async updateComment(id, data): Promise<IComment> {
    return httpProvider.patch(`/comment/${id}`, data);
  }

  /**
   * Delete Comment
   * @param id
   */
  static async deleteComment(id): Promise<IComment> {
    return httpProvider.delete(`/comment/${id}`);
  }
}
