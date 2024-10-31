import ApiService from '../plugins/api';

class UploadService {

  async list() {
    return await ApiService.get("/upload/listar");
  };
}

export default new UploadService();
