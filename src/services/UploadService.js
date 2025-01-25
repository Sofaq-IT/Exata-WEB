import ApiService from '../plugins/api';

class UploadService {

  async list() {
    return await ApiService.get("/upload/listar");
  };

  async details(uploadID) {
    return await ApiService.get("/upload/detalhes/" + uploadID);
  };

  async process(uploadID) {
    return await ApiService.get("/upload/processar/" + uploadID);
  };

  async listAttachments(uploadID) {
    return await ApiService.get("/upload/listarAnexos/" + uploadID);
  };

  async delete(uploadID) {
    return await ApiService.delete("/upload/" + uploadID);
  };
}

export default new UploadService();
