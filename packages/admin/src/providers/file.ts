import { httpProvider } from './http';

export class FileProvider {
  /**
   * Upload Files
   * @param file
   */
  static async uploadFile(file, unique = 0): Promise<IFile> {
    const formData = new FormData();
    formData.append('file', file);

    return httpProvider.post('/file/upload?unique=' + unique, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * Get The Specified File
   */
  static async getFiles(params): Promise<[IFile[], number]> {
    return httpProvider.get('/file', { params });
  }

  /**
   * Delete Files
   * @param id
   */
  static async deleteFile(id): Promise<IFile> {
    return httpProvider.delete(`/file/${id}`);
  }
}
