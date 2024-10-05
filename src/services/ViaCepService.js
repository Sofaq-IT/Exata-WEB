import axios from 'axios';
class ViaCepService {
  constructor() {
    this.client = axios.create({
      baseURL: 'https://viacep.com.br/ws/'
    });
  }

  async get(cep) {
    return await this.client.get(cep + '/json');
  }
}

export default new ViaCepService();