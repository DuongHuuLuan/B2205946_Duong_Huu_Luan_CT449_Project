// file: src/services/file.service.js

import createApiClient from "./api.service";

class FileService {
  constructor(baseURL = "/api/files") {
    this.api = createApiClient(baseURL);
  }

  /**
   * Tải lên một file ảnh lên server.
   * @param {File} file - Đối tượng File từ input.
   * @param {string} folder - Tên thư mục để lưu trên server (ví dụ: 'avatars', 'sach').
   * @returns {Promise<Object>} Object chứa thông tin file đã upload, bao gồm URL.
   */
  async upload(file, folder = "uploads") {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    // Axios sẽ tự động đặt Content-Type là multipart/form-data nhờ việc bỏ cài đặt cứng trong api.service
    return (await this.api.post("/", formData)).data;
  }
}

export default new FileService();
