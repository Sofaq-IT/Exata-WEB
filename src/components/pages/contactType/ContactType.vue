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
import ContactTypeService from "@/services/ContactTypeService";

export default {
  name: "ContactType",
  components: {
    DataTable,
  },
  data() {
    return {
      items: [],
      headers: [],
      title: "Tipos de Contato Cadastrados",
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
      tipoContato: {
        descricao: ""
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório"
      },
      fields: [],
    };
  },
  methods: {
    async listContactTypes() {
      try {
        const resp = await ContactTypeService.list(this.paginacaoRequest);

        this.paginacaoResponse = JSON.parse(resp.headers["x-paginacao"]);

        this.items = resp.data.map((x) => ({
          Ativo: x.ativo,
          Descricao: x.descricao,
          Id: x.tipoContatoID,
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
      await this.listContactTypes();
    },
    async updateFooter(data) {
      this.paginacaoRequest.pagina = data.page;
      this.paginacaoRequest.registroPorPagina = data.qtyItems;
      await this.listContactTypes();
    },
    async edit(id) {
      router.push("/interno/tipoContato/cadastro/" + id);
    },
    async inactivate(id) {
      Swal.fire({
        title: "Você está certo disso?",
        text: "Deseja realmente excluir esse tipo de contato. Essa operação não poderá ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, pode seguir",
        cancelButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await ContactTypeService.delete(id);
            AlertService.sucesso("Tipo de Contato removido com sucesso!");
            await this.listContactTypes();
          } catch (err) {
            console.log(err);
          }
        }
      });
    },    
    newReg() {
      router.push("/interno/tipoContato/cadastro");
    },
  },
  async mounted() {
    await this.listContactTypes();
    try {
      const resp = await ContactTypeService.getFilterFields();
      this.fields = resp.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
