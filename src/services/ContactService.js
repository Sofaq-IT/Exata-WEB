import ApiService from '../plugins/api';

class ContactService {

  async list(paginacao) {
    return await ApiService.list(
      "/contato/listar", {}, {
        "x-paginacao": JSON.stringify(paginacao),
      }
    )
  };

  async delete(id) {
    await ApiService.delete("/contato?id=" + id);
  }

  async getById(id) {
    return await ApiService.get("/contato?id=" + id);
  }

  async update(user) {
    await ApiService.put("/contato", user);
  }

  async add(user) {
    await ApiService.post("/contato", user);
  }

  async getFilterFields() {    
    return await ApiService.get('contato/campos');
  }

  async getContactTypes() {    
    return await ApiService.get('contato/contatoTipo');
  }

  async updateContactTypes(data, checked) {
    if (checked)
      await ApiService.post("/contato/contatoTipo", data);
    else
      await ApiService.deleteWithBody("/contato/contatoTipo", data);
  }

}

export default new ContactService();
