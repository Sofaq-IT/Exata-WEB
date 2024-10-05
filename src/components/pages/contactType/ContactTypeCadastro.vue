<template>
  <v-card>
    <v-card-title>Cadastro de Tipo de Contato</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5">
        <v-row>
          <v-col cols="12">
            <v-text-field
              v-model="tipoContato.descricao"
              label="Descrição"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" v-if="tipoContato.tipoContatoID">
            <v-switch
              label="Ativo"
              color="primary"
              v-model="tipoContato.ativo"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              color="orange"
              class="mr-2"
              @click="this.$router.push('/interno/tipoContato')"
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
import ContactTypeService from "@/services/ContactTypeService";
export default {
  name: "ContactTypeCadastro",
  data() {
    return {
      tipoContato: {
        id: null,
        ativo: true,
        descricao: ""
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
      },
    };
  },
  created() {    
    if (this.$route.params.id) {
      this.tipoContato.id = this.$route.params.id;
      this.carregarDadosTipoContato();
    }
  },
  methods: {
    async cadastrar() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        if (this.tipoContato.tipoContatoID) {
          try {
            await ContactTypeService.update(this.tipoContato);
            AlertService.sucesso(
              "Dados alterados com sucesso!",
              "/interno/tipoContato"
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await ContactTypeService.add(this.tipoContato);
            AlertService.sucesso(
              "Tipo de Contato cadastrado com sucesso!",
              "/interno/tipoContato"
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AlertService.erro("Por favor, preencha todos os campos obrigatórios.");
      }
    },
    async carregarDadosTipoContato() {
      try {
        const response = await ContactTypeService.getById(this.tipoContato.id);
        this.tipoContato = response.data;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>