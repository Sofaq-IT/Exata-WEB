<template>
  <v-card>
    <v-card-title>Cadastro de Contato</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5" @submit.prevent="cadastrar">
        <v-row>
          <v-col cols="8">
            <v-text-field
              v-model="contato.nome"
              label="Nome"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="contato.telefoneID"
              label="Telefone"
              v-mask="'###########'"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" v-if="contato.contatoID">
            <v-switch
              label="Ativo"
              color="primary"
              v-model="contato.ativo"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              color="orange"
              class="mr-2"
              @click="this.$router.push('/interno/contato')"
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
import ContactService from "@/services/ContactService";
import SectionService from "@/services/SectionService";
export default {
  name: "ContactCadastro",
  data() {
    return {
      novo: true,
      contato: {
        nome: "",
        ativo: true,
        telefoneID: ""
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
      },
      telefones:[]
    };
  },
  async created() {
    if (this.$route.params.id) {
      this.novo = false;
      this.contato.telefoneID = this.$route.params.id
      await this.carregarDadosContato();
    }
    this.listPhones();
  },
  methods: {
    async cadastrar() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        if (!this.novo) {
          try {
            await ContactService.update(this.contato);
            AlertService.sucesso(
              "Dados alterados com sucesso!",
              "/interno/contato"
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await ContactService.add(this.contato);
            AlertService.sucesso(
              "Contato cadastrado com sucesso!",
              "/interno/contato"
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AlertService.erro("Por favor, preencha todos os campos obrigatórios.");
      }
    },
    async carregarDadosContato() {
      try {
        const response = await ContactService.getById(this.contato.telefoneID);
        this.contato = response.data;
      } catch (err) {
        console.log(err);
      }
    },
    async listPhones() {
      try {
        const resp = await SectionService.getPhones();
        this.telefones = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>