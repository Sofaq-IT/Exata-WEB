import ApiService from '../plugins/api';

class DashboardService {

  async getDashboard(param) {
    return await ApiService.post("/dashboard", param);
  }

  async getRadar(param) {
    return await ApiService.post("/dashboard/getRadar", param);
  }

  async getFazendas(param) {
    return await ApiService.post("/dashboard/getFazendas", param);
  }

  async getTalhoes(param) {
    return await ApiService.post("/dashboard/getTalhoes", param);
  }

  async getGlebas(param) {
    return await ApiService.post("/dashboard/getGlebas", param);
  }

  async getPontos(param) {
    return await ApiService.post("/dashboard/getPontos", param);
  }

  async getProfundidades(param) {
    return await ApiService.post("/dashboard/getProfundidades", param);
  }

  async getAnos(param) {
    return await ApiService.post("/dashboard/getAnos", param);
  }

}

export default new DashboardService();
