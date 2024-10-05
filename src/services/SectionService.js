import ApiService from '../plugins/api';

class SectionService {

  async list(paginacao) {
    return await ApiService.list(
      "/secao/listar", {}, {
        "x-paginacao": JSON.stringify(paginacao),
      }
    )
  };

  async delete(id) {
    await ApiService.delete("/secao?id=" + id);
  }

  async getById(id) {
    return await ApiService.get("/secao?id=" + id);
  }

  async update(user) {
    await ApiService.put("/secao", user);
  }

  async add(user) {
    await ApiService.post("/secao", user);
  }

  async getFilterFields() {    
    return await ApiService.get('secao/campos');
  }

  async getPhones() {    
    return await ApiService.get('secao/telefone');
  }

}

export default new SectionService();
