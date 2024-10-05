<template>
  <v-form ref="formAlteracaoSenha" @submit.prevent="alterarSenha">
    <v-card prepend-icon="mdi-lock-reset" title="Alteração de Senha">
      <v-card-text>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="alteracaoSenha.senhaAntiga"
              label="Senha atual"
              :type="showPass1 ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              :rules="[rules.required, rules.min]"
              :append-icon="showPass1 ? 'mdi-eye' : 'mdi-eye-off'"
              counter
              hint="Mínimo de 8 caracteres"
              class="mb-3"
              @click:append="showPass1 = !showPass1"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="alteracaoSenha.senhaNova"
              label="Nova senha"
              :type="showPass2 ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              :rules="[rules.required, rules.min]"
              :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
              counter
              hint="Mínimo de 8 caracteres"
              class="mb-3"
              @click:append="showPass2 = !showPass2"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model="alteracaoSenha.senhaNovaConfirmacao"
              label="Confirmação de nova senha"
              :type="showPass3 ? 'text' : 'password'"
              prepend-icon="mdi-lock"
              :rules="[rules.required, rules.min]"
              :append-icon="showPass3 ? 'mdi-eye' : 'mdi-eye-off'"
              counter
              hint="Mínimo de 8 caracteres"
              class="mb-3"
              @click:append="showPass3 = !showPass3"
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
              type="submit"
              >Salvar</v-btn
            ></v-col
          >
        </v-row>
      </v-card-text>
    </v-card>
  </v-form>
</template>

<script>
import store from '@/plugins/store';
import AlertService from "@/plugins/alerts";
import UserService from "@/services/UserService";
export default {
  name: "FormAlteracaoSenha",
  data() {
    return {
      alteracaoSenha: {
        login: store.state.authToken.userName,
        senhaAntiga: "",
        senhaNova: "",
        senhaNovaConfirmacao: "",
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
        min: (v) => v.length >= 8 || "Mínimo de 8 caracteres",
      },
      showPass1: false,
      showPass2: false,
      showPass3: false,
    };
  },
  methods: {
    async alterarSenha() {
      const validation = await this.$refs.formAlteracaoSenha.validate();
      if (validation.valid) {
        try {
          await UserService.updatePassword(this.alteracaoSenha);
          AlertService.sucesso("Senha alterada com sucesso!");
          this.fechar();
        } catch (err) {
          console.log(err);
          this.fechar();
        }
      }
    },
    fechar() {
      this.$emit("fechar");
    },
  },
};
</script>
