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
              Cadastre sua nova senha
            </h5>
            <v-form
              ref="form"
              style="padding: 25px"
              @submit.prevent="updatePass"
            >
              <v-text-field
                v-model="password"
                label="Nova Senha"
                :type="showPass1 ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :rules="senhaRules"
                :append-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
                counter
                hint="Mínimo de 8 caracteres"
                class="mb-3"
                @click:append="showPass1 = !showPass1"
              ></v-text-field>
              
              <v-text-field
                v-model="confirmPassword"
                label="Confirme a Senha"
                :type="showPass2 ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :rules="confirmacaoSenhaRules"
                :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                counter
                hint="Mínimo de 8 caracteres"
                class="mb-3"
                @click:append="showPass2 = !showPass2"
              ></v-text-field>

              <v-divider></v-divider>
              <v-btn type="submit" class="mt-3 w-100">SALVAR NOVA SENHA</v-btn>
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
export default {
  data() {
    return {
      email: "",
      password: "",
      confirmPassword: "",
      error: null,
      showPass1: false,
      showPass2: false,
      logo: "",
    };
  },
  methods: {
    async updatePass() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        try {
          this.error = null;
          await ApiService.updatePass({ usuario: this.email, senha: this.password });

          this.$router.push("/interno/dashboard");
        } catch (err) {
          this.error = "Falha no login. Verifique suas credenciais.";
          console.error(err);
        }
      } else {
        this.error = "Por favor, preencha todos os campos obrigatórios.";
      }
    },
  },
  computed: {
    senhaRules() {
      return [
        (v) => !!v || "Senha é obrigatória",
        (v) => v.length >= 8 || "Mínimo de 8 caracteres",
      ];
    },
    confirmacaoSenhaRules() {
    return [
      (v) => !!v || "Confirmação de senha é obrigatória",
      (v) => v.length >= 8 || "Mínimo de 8 caracteres",
      (v) => v === this.password || "As senhas devem ser iguais"
    ];
  }
  },
  created() {
    this.email = window.localStorage.getItem('emailVerification');
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
