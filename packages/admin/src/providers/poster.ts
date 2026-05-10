import { httpProvider } from './http';

export class PosterProvider {
  /**
   * Get The Specified File
   */
  static async getPosters(params): Promise<[IPoster[], number]> {
    return httpProvider.get('/poster', { params });
  }

  /**
   * Delete Files
   * @param id
   */
  static async deletePoster(id): Promise<IPoster> {
    return httpProvider.delete(`/poster/${id}`);
  }
}
