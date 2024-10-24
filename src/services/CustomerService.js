import ApiService from '../plugins/api';

class CustomerService {

  async list(paginacao) {
    return await ApiService.list(
      "/cliente/listar", {}, {
        "x-paginacao": JSON.stringify(paginacao),
      }
    )
  };

  async delete(id) {
    await ApiService.delete("/cliente?id=" + id);
  }

  async getById(id) {
    return await ApiService.get("/cliente?id=" + id);
  }

  async update(user) {
    await ApiService.put("/cliente", user);
  }

  async add(user) {
    await ApiService.post("/cliente", user);
  }

  async getFilterFields() {    
    return await ApiService.get('cliente/campos');
  }

}

export default new CustomerService();
