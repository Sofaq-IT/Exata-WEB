<template>
  <v-card>
    <v-card-title>Cadastro de Seção</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="secao.descricao"
              label="Descrição"
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-select
              v-model="secao.telefoneID"
              item-title="descricao"
              item-value="telefoneID"
              label="Telefone"
              :items="telefones"
              :rules="[rules.required]"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="6" v-if="secao.secaoID">
            <v-switch
              label="Ativo"
              color="primary"
              v-model="secao.ativo"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <v-col cols="12" class="d-flex justify-end">
            <v-btn
              variant="outlined"
              color="orange"
              class="mr-2"
              @click="this.$router.push('/interno/secao')"
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
import SectionService from "@/services/SectionService";
export default {
  name: "SectionCadastro",
  data() {
    return {
      secao: {
        id: null,
        descricao: "",
        ativo: true,
        telefoneID: null,
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório",
      },
      telefones: [],
    };
  },
  created() {
    if (this.$route.params.id) {
      this.secao.id = this.$route.params.id;
      this.carregarDadosSecao();
    }
    this.listPhones();
  },
  methods: {
    async cadastrar() {
      const validation = await this.$refs.form.validate();
      if (validation.valid) {
        if (this.secao.secaoID) {
          try {
            await SectionService.update(this.secao);
            AlertService.sucesso(
              "Dados alterados com sucesso!",
              "/interno/secao"
            );
          } catch (error) {
            console.log(error);
          }
        } else {
          try {
            await SectionService.add(this.secao);
            AlertService.sucesso(
              "Seção cadastrado com sucesso!",
              "/interno/secao"
            );
          } catch (error) {
            console.log(error);
          }
        }
      } else {
        AlertService.erro("Por favor, preencha todos os campos obrigatórios.");
      }
    },
    async carregarDadosSecao() {
      try {
        const response = await SectionService.getById(this.secao.id);
        this.secao = response.data;
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