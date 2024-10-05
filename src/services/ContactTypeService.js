import ApiService from '../plugins/api';

class ContactTypeService {

  async list(paginacao) {
    return await ApiService.list(
      "/tipoContato/listar", {}, {
        "x-paginacao": JSON.stringify(paginacao),
      }
    )
  };

  async delete(id) {
    await ApiService.delete("/tipoContato?id=" + id);
  }

  async getById(id) {
    return await ApiService.get("/tipoContato?id=" + id);
  }

  async update(user) {
    await ApiService.put("/tipoContato", user);
  }

  async add(user) {
    await ApiService.post("/tipoContato", user);
  }

  async getFilterFields() {    
    return await ApiService.get('tipoContato/campos');
  }

}

export default new ContactTypeService();
