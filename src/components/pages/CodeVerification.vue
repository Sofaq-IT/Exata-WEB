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
            <h5 style="text-align: center">Enviamos um Código de Verificação para o seu e-mail.</h5>
            <h5 style="text-align: center">Favor verificar e digitá-lo abaixo para seguir.</h5>
            <v-form
              ref="form"
              style="padding: 25px"
              @submit.prevent="verifyCode"
            >
              <v-otp-input
               v-model="codigo"
              ></v-otp-input>
              
              <v-divider></v-divider>
              <v-btn type="submit" class="mt-3 w-100" :disabled="codigo.length < 6">VERIFICAR CÓDIGO</v-btn>
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
      codigo: "",
      error: null,
      logo: "",
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
        min: (v) => v.length >= 8 || "Mínimo de 8 caracteres",
      },
    };
  },
  methods: {
    async verifyCode() {
        try {
          this.error = null;
          await ApiService.verifyCode({ email: this.email, codigo: this.codigo });
          this.$router.push("/cadastroSenha");
        } catch (err) {
          this.error = "Falha ao verificar código.";
          console.error(err);
        }
    },
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
