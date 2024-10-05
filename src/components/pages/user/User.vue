<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <DataTable
          :items="items"
          :filters="fields"
          :title="title"
          :showSearch="true"
          :footer="paginacaoResponse"
          :showEdit="true"
          :showInactivate="true"
          :showResetPassword="true"
          @updateFilter:filter="updateFilter"
          @updateFooter:fields="updateFooter"
          @edit:id="edit"
          @inactivate:id="inactivate"
          @resetPassword:id="resetPassword"
          @newReg="newReg"
        />
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="showUpdatePassword" width="720">
    <v-card prepend-icon="mdi-update" title="Reset de senha">
      <v-divider></v-divider>
      <v-container>
        <v-form ref="form" @submit.prevent="resetarSenha">
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Nome"
                disabled
                v-model="usuario.nome"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Login"
                disabled
                v-model="usuario.userName"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                label="Email"
                disabled
                v-model="usuario.email"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-divider></v-divider>
          <v-row class="mt-2">
            <v-col cols="12">Entre com a nova senha no campo abaixo:</v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="usuario.senha"
                label="Senha"
                :type="showPass ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :rules="[rules.required, rules.min]"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                counter
                hint="Mínimo de 8 caracteres"
                class="mb-3"
                @click:append="showPass = !showPass"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="mt-2">
            <v-col cols="5">
              <v-btn
                variant="outlined"
                color="error"
                class="w-100"
                @click="showUpdatePassword = false"
                >Cancelar</v-btn
              >
            </v-col>
            <v-col cols="2"></v-col>
            <v-col cols="5">
              <v-btn
                type="submit"
                variant="outlined"
                color="secondary"
                class="w-100"
                >Resetar a Senha</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import router from "@/router";
import Swal from "sweetalert2";
import DataTable from "@/components/DataTable.vue";
import AlertService from "@/plugins/alerts";
import UserService from "@/services/UserService";

export default {
  name: "User",
  components: {
    DataTable,
  },
  data() {
    return {
      items: [],
      headers: [],
      title: "Usuários Cadastrados",
      paginacaoRequest: {
        pagina: 1,
        registroPorPagina: 5,
        ativos: null,
        pesquisarCampo: "",
        pesquisarValor: "",
        orderCampo: "DataCadastro",
        orderTipoAsc: true,
      },
      paginacaoResponse: {
        TotalRegistros: 0,
        RegistrosPorPagina: 0,
        PaginaAtual: 0,
        TotalPaginas: 0,
        TemProximo: false,
        TemAnterior: false,
      },
      showUpdatePassword: false,
      usuario: {
        nome: "",
        userName: "",
        email: "",
        senha: "",
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
        min: (v) => v.length >= 8 || "Mínimo de 8 caracteres",
      },
      showPass: false,
      fields: [],
    };
  },
  methods: {
    async listUsers() {
      try {
        const resp = await UserService.list(this.paginacaoRequest);

        this.paginacaoResponse = JSON.parse(resp.headers["x-paginacao"]);

        this.items = resp.data.map((x) => ({
          Ativo: x.ativo,
          Nome: x.nome,
          Login: x.userName,
          Email: x.email,
          Celular: x.phoneNumber,
          Id: x.id,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    async updateFilter(data) {
      this.paginacaoRequest.pesquisarCampo = data.key;
      this.paginacaoRequest.pesquisarValor = data.value;
      this.paginacaoRequest.orderCampo = data.orderBy;
      this.paginacaoRequest.orderTipoAsc = data.asc;
      this.paginacaoRequest.ativos = data.status;
      await this.listUsers();
    },
    async updateFooter(data) {
      this.paginacaoRequest.pagina = data.page;
      this.paginacaoRequest.registroPorPagina = data.qtyItems;
      await this.listUsers();
    },
    async edit(id) {
      router.push("/interno/usuario/cadastro/" + id);
    },
    async inactivate(id) {
      Swal.fire({
        title: "Você está certo disso?",
        text: "Deseja realmente excluir esse usuário. Essa operação não poderá ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, pode seguir",
        cancelButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await UserService.delete(id);
            AlertService.sucesso("Usuário removido com sucesso!");
            await this.listUsers();
          } catch (err) {
            console.log(err);
          }
        }
      });
    },
    async resetPassword(id) {
      try {
        const response = await UserService.getById(id);
        this.usuario = response.data;
      } catch (err) {
        console.log(err);
      }
      this.showUpdatePassword = true;
    },
    async resetarSenha() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        try {
          await UserService.updatePasswordAdm({
            login: this.usuario.userName,
            senhaNova: this.usuario.senha,
          });

          AlertService.sucesso("Senha alterada com sucesso!");
          this.usuario = {
            nome: "",
            userName: "",
            email: "",
            senha: "",
          };
          this.showUpdatePassword = false;
        } catch (err) {
          console.log(err);
        }
      }
    },
    newReg() {
      router.push("/interno/usuario/cadastro");
    },
  },
  async mounted() {
    await this.listUsers();
    try {
      const resp = await UserService.getFilterFields();
      this.fields = resp.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
