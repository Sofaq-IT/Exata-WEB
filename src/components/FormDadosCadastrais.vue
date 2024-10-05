<template>
  <v-card prepend-icon="mdi-account" title="Meus dados cadastrais">
    <v-card-text>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            label="Perfil"
            disabled
            v-model="usuario.perfilID"
          ></v-text-field>
        </v-col>
        <v-col cols="8">
          <v-text-field
            label="Nome"
            disabled
            v-model="usuario.nome"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="4">
          <v-text-field
            label="Login"
            disabled
            v-model="usuario.userName"
          ></v-text-field>
        </v-col>
        <v-col cols="8">
          <v-text-field
            label="Telefone"
            disabled
            v-model="usuario.phoneNumber"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row dense>
        <v-col cols="12">
          <v-text-field
            label="Email"
            disabled
            v-model="usuario.email"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="mb-2">
        <v-col cols="5"
          ><v-btn color="red" variant="outlined" class="w-100" @click="fechar"
            >Fechar</v-btn
          ></v-col
        >
        <v-col cols="2"></v-col>
        <v-col cols="5"
          ><v-btn
            color="secondary"
            variant="outlined"
            class="w-100"
            @click="abrirAlteracaoSenha"
            >Alterar minha senha</v-btn
          ></v-col
        >
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import store from "@/plugins/store";
import UserService from "@/services/UserService";
export default {
  name: "FormDadosCadastrais",
  data() {
    return {
      usuario: {
        userName: "",
        email: "",
        phoneNumber: "",
        nome: "",
        perfilID: null,
      },
    };
  },
  methods: {
    async carregarDadosUsuario() {
      try {
        const response = await UserService.getById(store.state.authToken.id);
        this.usuario = response.data;
      } catch (err) {
        console.log(err);
        this.$emit("fechar");
      }
    },
    fechar() {
      this.$emit("fechar");
    },
    abrirAlteracaoSenha() {
      this.$emit("abrirAlteracaoSenha");
    },
  },
  mounted() {
    this.carregarDadosUsuario();
  },
};
</script>
