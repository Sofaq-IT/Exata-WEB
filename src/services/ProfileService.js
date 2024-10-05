import ApiService from '../plugins/api';

class ProfileService {

  async list(paginacao) {
    return await ApiService.list(
      "/perfil/listar", {}, {
        "x-paginacao": JSON.stringify(paginacao),
      }
    )
  };

  async delete(id) {
    await ApiService.delete("/perfil?id=" + id);
  }

  async getById(id) {
    return await ApiService.get("/perfil?id=" + id);
  }

  async update(user) {
    await ApiService.put("/perfil", user);
  }

  async add(user) {
    await ApiService.post("/perfil", user);
  }

  async listPermissions() {
    return await ApiService.get("/perfil/controllerAction");
  }

  async updatePermission(data, checked) {
    if (checked)
      await ApiService.post("/perfil/controllerAction", data);
    else
      await ApiService.deleteWithBody("/perfil/controllerAction", data);
  }

  async getFilterFields() {    
    return await ApiService.get('perfil/campos');
  }

  async getSections() {    
    return await ApiService.get('perfil/perfilSecao');
  }

  async updateSection(data, checked) {
    if (checked)
      await ApiService.post("/perfil/perfilSecao", data);
    else
      await ApiService.deleteWithBody("/perfil/perfilSecao", data);
  }
}

export default new ProfileService();
