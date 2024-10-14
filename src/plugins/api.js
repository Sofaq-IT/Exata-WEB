import axios from 'axios';
import router from '@/router';
import Swal from 'sweetalert2';
import store from './store';

class ApiService {
  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config) => {
        store.dispatch('showLoading');
        const authToken = store.state.authToken;
        if (authToken) {
          config.headers['Authorization'] = `Bearer ${authToken.token}`;
        }
        return config;
      },
      (error) => {
        store.dispatch('hideLoading');
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        store.dispatch('hideLoading');
        return response;
      },
      async (error) => {
        store.dispatch('hideLoading');
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const newToken = await this.refreshToken();
          store.commit('setToken', newToken);
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return this.client(originalRequest);
        } else if (error.response.status === 400 && error.config.url.indexOf('token-atualizacao') > 0) {
          router.push('/login');
        } else if ([400, 401, 404, 500].indexOf(error.response.status) >= 0) {
          const mensagens = error.response.data.mensagens;
          const erros = error.response.data.errors;

          let msgsErrosHtml = '';

          if (mensagens) {
            mensagens.forEach(msg => {
              msgsErrosHtml += '<li>' + msg + '</li>';
            });

            Swal.fire({
              icon: 'error',
              title: 'Ops! Encontramos um problema.',
              html: '<div style="text-align: left;"><p style="margin-bottom: 20px;">Ocorreu um erro na solicitação. Segue lista de erros:</p><ul style="margin-left: 20px;">' + msgsErrosHtml + '</ul></div>',
            });
            return Promise.reject(error);
          } else if (erros) {
            for (const key in erros) {
              if (erros.hasOwnProperty(key)) {
                erros[key].forEach(error => {
                  msgsErrosHtml += '<li>' + error + '</li>';
                });
              }
            }

            Swal.fire({
              icon: 'error',
              title: 'Ops! Encontramos um problema.',
              html: '<div style="text-align: left;"><p>Ocorreu um erro na solicitação.</p><p style="margin-bottom: 20px;">Segue lista de erros:</p><ul style="margin-left: 20px;">' + msgsErrosHtml + '</ul></div>',
            });
            return Promise.reject(error);
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Ops! Encontramos um problema.',
              text: 'Não foi possível realizar a operação. Informe ao administrador do sistema',
            });
            return Promise.reject(error);
          }
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ops! Encontramos um problema.',
            text: 'Não foi possível realizar a operação. Informe ao administrador do sistema',
          });
          return Promise.reject(error);
        }
      }
    );
  }

  async login(credentials) {
    const response = await this.client.post('/autenticacao/login', credentials);
    store.commit('setToken', response.data);
    return response.data;
  }

  async forgotPass(credentials) {
    const response = await this.client.post('/autenticacao/esqueciMinhaSenha', credentials);
    return response.data;
  }

  async verifyCode(dados) {
    const response = await this.client.post('/autenticacao/verificarCodigo', dados);
    return response.data;
  }

  async updatePass(dados) {
    const response = await this.client.put('/autenticacao/atualizarSenha', dados);
    return response.data;
  }

  async refreshToken() {
    const authToken = store.state.authToken;
    const response = await this.client.post('/autenticacao/token-atualizacao', authToken);
    return response.data;
  }

  async isAuthenticated() {
    const token = store.state.authToken;
    return !!token;
  }

  async logout() {
    store.commit('setToken', null);
    store.commit('setTheme', false);
    router.push('/login');

  }

  async get(url, params = {}) {
    return this.client.get(url, {
      params
    });
  }

  async list(url, params = {}, headers = {}) {
    return this.client.get(url, {
      params,
      headers
    });
  }

  async post(url, data) {
    return this.client.post(url, data);
  }

  async put(url, data) {
    return this.client.put(url, data);
  }

  async delete(url) {
    return this.client.delete(url);
  }

  async deleteWithBody(url, data) {
    return this.client.delete(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    });
  }

  async patch(url, data) {
    return this.client.patch(url, data);
  }

  async options(url) {
    return this.client.options(url);
  }
}

export default new ApiService();
