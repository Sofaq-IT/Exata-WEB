import ApiService from '../plugins/api';

class UploadService {

  async list() {
    return await ApiService.get("/upload/listar");
  };

  async details(uploadID) {
    return await ApiService.get("/upload/detalhes/" + uploadID);
  };
}

export default new UploadService();
