import ApiService from '../plugins/api';

class ContractorService {

  async update(data) {
    await ApiService.put("/contratante", data);
  }

  async updateLogo(data) {
    await ApiService.patch("/contratante/incluirLogo", data);
  }

  async getContractor() {
    return await ApiService.get('/contratante');
  }

  async getLogo() {
    return await ApiService.get('/contratante/logo');
  }
}

export default new ContractorService();
