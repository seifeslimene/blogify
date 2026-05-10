import { httpProvider } from './http';

export class CategoryProvider {
  /**
   * Get All Tags
   */
  static async getCategory(params): Promise<ICategory[]> {
    return httpProvider.get('/category', { params });
  }

  /**
   * add Tag
   * @param data
   */
  static async add(data): Promise<ICategory> {
    return httpProvider.post('/category', data);
  }

  /**
   * Get Category
   * @param id
   */
  static async getCategoryById(id): Promise<ICategory> {
    return httpProvider.get(`/category/${id}`);
  }

  /**
   * Update Tags
   * @param id
   * @param data
   */
  static async update(id, data): Promise<ICategory> {
    return httpProvider.patch(`/category/${id}`, data);
  }

  /**
   * Delete Tag
   * @param id
   */
  static async delete(id): Promise<ICategory> {
    return httpProvider.delete(`/category/${id}`);
  }
}
