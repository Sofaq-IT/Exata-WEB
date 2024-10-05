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
            <h5 style="text-align: center">
              Plataforma para Agricultura de Precisão
            </h5>
            <v-form
              ref="form"
              style="padding: 25px"
              @submit.prevent="handleLogin"
            >
              <v-text-field
                v-model="login"
                label="Login"
                prepend-icon="mdi-account"
                :rules="[rules.required]"
              ></v-text-field>
              <v-text-field
                v-model="password"
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
              <v-divider></v-divider>
              <v-btn type="submit" class="mt-3 w-100">Entrar</v-btn>
            </v-form>
            <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="3"></v-col>
      <!-- <v-col cols="8" style="padding: 0">
        <img
          src="https://getbots.com.br/wp-content/uploads/2022/12/chatbot-para-google-business-messages.jpg"
          style="width: 100%; min-height: 610px"
        />
      </v-col> -->
    </v-row>
  </v-container>
</template>

<script>
import ApiService from "@/plugins/api";
import store from "@/plugins/store";
import ContractorService from "@/services/ContractorService";
export default {
  data() {
    return {
      login: "",
      password: "",
      error: null,
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
        min: (v) => v.length >= 8 || "Mínimo de 8 caracteres",
      },
      showPass: false,
      logo: "",
    };
  },
  methods: {
    async handleLogin() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        try {
          this.error = null;
          const credentials = {
            usuario: this.login,
            senha: this.password,
          };
          const response = await ApiService.login(credentials);

          if (response && response.tema) {
            if (response.tema === "light") store.dispatch("setLight");
            else store.dispatch("setDark");
          }

          this.$router.push("/interno/dashboard");
        } catch (err) {
          this.error = "Falha no login. Verifique suas credenciais.";
          console.error(err);
        }
      } else {
        this.error = "Por favor, preencha todos os campos obrigatórios.";
      }
    },
    async getLog() {
      try {
        const resp = await ContractorService.getLogo();
        if (resp.data) {
          this.logo = "data:image/png;base64," + resp.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    store.commit("setToken", null);
    this.getLog();
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
