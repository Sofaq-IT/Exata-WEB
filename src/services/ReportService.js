import ApiService from '../plugins/api';

class ReportService {

  async getInformacaoClientes(filter) {
    return await ApiService.post("/relatorio/getInformacaoClientes", filter);
  }

  async getAmostraClientes(filter) {
    return await ApiService.post("/relatorio/getAmostraClientes", filter);
  }

  async getPlanoClientes(filter) {
    return await ApiService.post("/relatorio/getPlanoClientes", filter);
  }

  async getAmostraPlanos(filter) {
    return await ApiService.post("/relatorio/getAmostraPlanos", filter);
  }

}

export default new ReportService();
