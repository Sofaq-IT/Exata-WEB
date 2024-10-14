<template>
  <v-container style="padding-top: 5%">
    <v-row align="center" justify="center">
      <v-col cols="6" offset="3">
        <v-card>
          <v-card-text>
            <v-img
              src='@/assets/logo-exata.png'
              class="logo"
              contain
              width="250"
            ></v-img>
            <h3 style="text-align: center">
              Plataforma para Agricultura de Precisão
            </h3>
            <h5 style="text-align: center">
              Preencha o e-mail cadastrado para atualizar sua senha.
            </h5>
            <v-form
              ref="form"
              style="padding: 25px"
              @submit.prevent="updatePass"
            >
              <v-text-field
                v-model="email"
                label="E-mail "
                prepend-icon="mdi-email-outline"
                :rules="emailRules"
              ></v-text-field>
              
              <v-divider></v-divider>
              <v-btn type="submit" class="mt-3 w-100">ALTERAR SENHA</v-btn>
            </v-form>
            <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3"></v-col>
    </v-row>
  </v-container>
</template>

<script>
import ApiService from "@/plugins/api";
import store from "@/plugins/store";
export default {
  data() {
    return {
      email: "",
      error: null,
      logo: "",
    };
  },
  methods: {
    async updatePass() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        try {
          this.error = null;
          await ApiService.forgotPass(JSON.stringify(this.email));
          window.localStorage.setItem('emailVerification', this.email);
          this.$router.push("/verificacaoCodigo");
        } catch (err) {
          this.error = "Falha ao solicitar nova senha.";
          console.error(err);
        }
      } else {
        this.error = "Por favor, preencha todos os campos obrigatórios.";
      }
    },
  },
  computed: {
    emailRules() {
      return [
        (v) => !!v || "E-mail é obrigatório",
        (v) => /.+@.+\..+/.test(v) || "E-mail deve ser válido",
      ];
    },
  },
};
</script>

<style scoped>
.v-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  color: #1976d2;
  font-weight: bold;
  text-align: center;
}

.v-btn {
  color: white;
  background-color: #1976d2;
}

.v-text-field input {
  color: #333;
}

.v-text-field .v-label {
  color: #1976d2;
}

.logo {
  display: block;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
</style>
