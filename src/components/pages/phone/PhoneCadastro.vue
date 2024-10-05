<template>
  <v-card>
    <v-card-title>Cadastro de Telefone</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="telefone.descricao"
              label="Descrição"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="telefone.telefone"
              label="Telefone"
              v-mask="'(##) #####-####'"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" v-if="telefone.telefoneID">
            <v-switch
              label="Ativo"
              color="primary"
              v-model="telefone.ativo"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              color="orange"
              class="mr-2"
              @click="this.$router.push('/interno/telefone')"
              >Voltar</v-btn
            >
            <v-btn variant="outlined" color="secondary" @click="cadastrar"
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
import PhoneService from "@/services/PhoneService";
export default {
  name: "PhoneCadastro",
  data() {
    return {
      telefone: {
        id: null,
        descricao: "",
        telefone: "",
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
      },
    };
  },
  created() {    
    if (this.$route.params.id) {
      this.telefone.id = this.$route.params.id;
      this.carregarDadosTelefone();
    }
  },
  methods: {
    async cadastrar() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        if (this.telefone.telefoneID) {
          try {
            await PhoneService.update(this.telefone);
            AlertService.sucesso(
              "Dados alterados com sucesso!",
              "/interno/telefone"
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await PhoneService.add(this.telefone);
            AlertService.sucesso(
              "Telefone cadastrado com sucesso!",
              "/interno/telefone"
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AlertService.erro("Por favor, preencha todos os campos obrigatórios.");
      }
    },
    async carregarDadosTelefone() {
      try {
        const response = await PhoneService.getById(this.telefone.id);
        this.telefone = response.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>