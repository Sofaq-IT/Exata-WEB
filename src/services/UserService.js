import ApiService from '../plugins/api';

class UserService {

  async list(paginacao) {
    return await ApiService.list(
      "/usuario/listar", {}, {
        "x-paginacao": JSON.stringify(paginacao),
      }
    )
  };

  async delete(id) {
    await ApiService.delete("/usuario?id=" + id);
  }

  async getById(id) {
    return await ApiService.get("/usuario?id=" + id);
  }

  async update(user) {
    await ApiService.put("/usuario", user);
  }

  async add(user) {
    await ApiService.post("/usuario", user);
  }

  async updatePasswordAdm(data) {
    await ApiService.patch("/usuario/alterarSenhaADM", data);
  }

  async updatePassword(data) {
    await ApiService.patch("/usuario/alterarSenha", data);
  }

  async listProfiles() {
    return await ApiService.get("/usuario/perfil");
  }

  async updateTheme(data) {
    await ApiService.patch("usuario/alterarTema", data);
  }

  async getFilterFields() {    
    return await ApiService.get('usuario/campos');
  }

  async updateAvatar(data) {
    await ApiService.patch("usuario/incluirAvatar", data);
  }

}

export default new UserService();
