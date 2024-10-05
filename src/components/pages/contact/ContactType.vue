<template>
  <v-card>
    <v-card-title>Atribuição de Tipos de Contato</v-card-title>
    <v-card-subtitle></v-card-subtitle>
    <v-card-text>
      <v-divider></v-divider>
      <v-form ref="form" class="mt-5">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="contato.nome"
              label="Descrição"
              disabled
            ></v-text-field>
          </v-col>
          <v-col cols="6">
            <v-text-field
              v-model="contato.telefoneID"
              label="Telefone"
              disabled
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h2>Tipos de Contato</h2>
          </v-col>
        </v-row>
        <v-divider class="mt-2 mb-2"></v-divider>
        <v-row>
          <v-col cols="3" v-for="t in tiposContato" :key="t">
            <v-switch
              :label="t.descricao"
              color="primary"
              v-model="t.checked"
              @update:modelValue="
                (checked) => atualizarTipoContato(t.tipoContatoID, checked)
              "
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
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import ContactService from "@/services/ContactService";
export default {
  name: "ContactType",
  data() {
    return {
      contato: {
        telefoneID: "",
        nome: "",
      },
      tiposContato: [],
    };
  },
  async created() {
    this.contato.telefoneID = this.$route.params.id ? this.$route.params.id : "";
    await this.listarTiposContato();
    await this.carregarDadosContato();
  },
  methods: {
    async carregarDadosContato() {
      try {
        const response = await ContactService.getById(this.contato.telefoneID);
        this.contato = response.data;
        this.marcarTiposContato();
      } catch (err) {
        console.log(err);
      }
    },
    async marcarTiposContato() {
      const tiposMarcados = this.contato.contatoTipo.map(
        (p) => p.tipoContatoID
      );

      this.tiposContato.forEach(
        (p) =>
          (p.checked =
            tiposMarcados.indexOf(p.tipoContatoID) >= 0
              ? true
              : false)
      );
    },
    async atualizarTipoContato(tipoContatoID, checked) {
      try {
        await ContactService.updateContactTypes(
          {
            telefoneID: this.contato.telefoneID,
            tipoContatoID: tipoContatoID,
          },
          checked
        );
      } catch (err) {
        console.log(err);
      }
    },
    async listarTiposContato() {
      try {
        const response = await ContactService.getContactTypes();
        this.tiposContato = response.data;
        this.tiposContato.forEach((s) => (s.checked = false));
      } catch (err) {
        console.log(err);
      }
    }
  },
};
</script>