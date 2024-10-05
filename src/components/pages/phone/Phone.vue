<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <DataTable
          :items="items"
          :filters="fields"
          :title="title"
          :showSearch="true"
          :footer="paginacaoResponse"
          :showEdit="true"
          :showInactivate="true"
          @updateFilter:filter="updateFilter"
          @updateFooter:fields="updateFooter"
          @edit:id="edit"
          @inactivate:id="inactivate"
          @resetPassword:id="resetPassword"
          @newReg="newReg"
        />
      </v-col>
    </v-row>
  </v-container>  
</template>

<script>
import router from "@/router";
import Swal from "sweetalert2";
import DataTable from "@/components/DataTable.vue";
import AlertService from "@/plugins/alerts";
import PhoneService from "@/services/PhoneService";

export default {
  name: "Phone",
  components: {
    DataTable,
  },
  data() {
    return {
      items: [],
      headers: [],
      title: "Telefones Cadastrados",
      paginacaoRequest: {
        pagina: 1,
        registroPorPagina: 5,
        ativos: null,
        pesquisarCampo: "",
        pesquisarValor: "",
        orderCampo: "DataCadastro",
        orderTipoAsc: true,
      },
      paginacaoResponse: {
        TotalRegistros: 0,
        RegistrosPorPagina: 0,
        PaginaAtual: 0,
        TotalPaginas: 0,
        TemProximo: false,
        TemAnterior: false,
      },
      telefone: {
        descricao: "",
        telefone: ""
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório"
      },
      fields: [],
    };
  },
  methods: {
    async listPhones() {
      try {
        const resp = await PhoneService.list(this.paginacaoRequest);

        this.paginacaoResponse = JSON.parse(resp.headers["x-paginacao"]);

        this.items = resp.data.map((x) => ({
          Ativo: x.ativo,
          Descricao: x.descricao,
          Telefone: x.telefone,
          Id: x.telefoneID,
        }));
      } catch (error) {
        console.log(error);
      }
    },
    async updateFilter(data) {
      this.paginacaoRequest.pesquisarCampo = data.key;
      this.paginacaoRequest.pesquisarValor = data.value;
      this.paginacaoRequest.orderCampo = data.orderBy;
      this.paginacaoRequest.orderTipoAsc = data.asc;
      this.paginacaoRequest.ativos = data.status;
      await this.listPhones();
    },
    async updateFooter(data) {
      this.paginacaoRequest.pagina = data.page;
      this.paginacaoRequest.registroPorPagina = data.qtyItems;
      await this.listPhones();
    },
    async edit(id) {
      router.push("/interno/telefone/cadastro/" + id);
    },
    async inactivate(id) {
      Swal.fire({
        title: "Você está certo disso?",
        text: "Deseja realmente excluir esse telefone. Essa operação não poderá ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, pode seguir",
        cancelButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await PhoneService.delete(id);
            AlertService.sucesso("Telefone removido com sucesso!");
            await this.listPhones();
          } catch (err) {
            console.log(err);
          }
        }
      });
    },    
    newReg() {
      router.push("/interno/telefone/cadastro");
    },
  },
  async mounted() {
    await this.listPhones();
    try {
      const resp = await PhoneService.getFilterFields();
      this.fields = resp.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
