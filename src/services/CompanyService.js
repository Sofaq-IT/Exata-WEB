import ApiService from '../plugins/api';

class CompanyService {

  async list(paginacao) {
    return await ApiService.list(
      "/empresa/listar", {}, {
        "x-paginacao": JSON.stringify(paginacao),
      }
    )
  };

  async delete(id) {
    await ApiService.delete("/empresa?id=" + id);
  }

  async getById(id) {
    return await ApiService.get("/empresa?id=" + id);
  }

  async update(user) {
    await ApiService.put("/empresa", user);
  }

  async add(user) {
    await ApiService.post("/empresa", user);
  }

  async getFilterFields() {    
    return await ApiService.get('empresa/campos');
  }

}

export default new CompanyService();
