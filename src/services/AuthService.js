import ApiService from '../plugins/api';

class AuthService {

  async getLicense() {
    return await ApiService.get("/autenticacao/licenca");
  }

}

export default new AuthService();
