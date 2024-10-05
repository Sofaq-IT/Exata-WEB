<template>
  <v-card>
    <v-card-title>Cadastro de Perfil</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5" @submit.prevent="cadastrar">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="perfil.descricao"
              label="Descrição"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" v-if="perfil.perfilID">
            <v-switch
              label="Ativo"
              color="primary"
              v-model="perfil.ativo"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              color="orange"
              class="mr-2"
              @click="this.$router.push('/interno/perfil')"
              >Voltar</v-btn
            >
            <v-btn variant="outlined" color="secondary" type="submit"
              >Salvar</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import AlertService from "@/plugins/alerts";
import ProfileService from "@/services/ProfileService";
export default {
  name: "Profile",
  data() {
    return {
      perfil: {
        perfilID: 0,
        descricao: "",
        ativo: true,
        perfilControllerAction: [],
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
      },
      permissoes: [],
    };
  },
  async created() {
    this.perfil.perfilID = this.$route.params.id ? this.$route.params.id : 0;
    if (this.perfil.perfilID) {
      await this.carregarDadosPerfil();
    }
  },
  methods: {
    async cadastrar() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        if (this.perfil.perfilID) {
          try {
            await ProfileService.update(this.perfil);
            AlertService.sucesso(
              "Dados alterados com sucesso!",
              "/interno/perfil"
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await ProfileService.add(this.perfil);
            AlertService.sucesso(
              "Perfil cadastrado com sucesso!",
              "/interno/perfil"
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AlertService.erro("Por favor, preencha todos os campos obrigatórios.");
      }
    },
    async carregarDadosPerfil() {
      try {
        const response = await ProfileService.getById(this.perfil.perfilID);
        this.perfil = response.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>