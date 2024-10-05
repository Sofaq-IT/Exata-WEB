import ApiService from '../plugins/api';

class PhoneService {

  async list(paginacao) {
    return await ApiService.list(
      "/telefone/listar", {}, {
        "x-paginacao": JSON.stringify(paginacao),
      }
    )
  };

  async delete(id) {
    await ApiService.delete("/telefone?id=" + id);
  }

  async getById(id) {
    return await ApiService.get("/telefone?id=" + id);
  }

  async update(user) {
    await ApiService.put("/telefone", user);
  }

  async add(user) {
    await ApiService.post("/telefone", user);
  }

  async getFilterFields() {    
    return await ApiService.get('telefone/campos');
  }

}

export default new PhoneService();
