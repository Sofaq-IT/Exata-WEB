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
import SectionService from "@/services/SectionService";

export default {
  name: "Section",
  components: {
    DataTable,
  },
  data() {
    return {
      items: [],
      headers: [],
      title: "Seções Cadastradas",
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
      secao: {
        descricao: "",
      },
      rules: {
        required: (value) => !!value || "Este campo é obrigatório"
      },
      fields: [],
    };
  },
  methods: {
    async listSections() {
      try {
        const resp = await SectionService.list(this.paginacaoRequest);

        this.paginacaoResponse = JSON.parse(resp.headers["x-paginacao"]);

        this.items = resp.data.map((x) => ({
          Ativo: x.ativo,
          Descricao: x.descricao,
          Telefone: x.telefone ? x.telefone.telefone + ' - ' +  x.telefone.descricao : '',
          Id: x.secaoID,
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
      await this.listSections();
    },
    async updateFooter(data) {
      this.paginacaoRequest.pagina = data.page;
      this.paginacaoRequest.registroPorPagina = data.qtyItems;
      await this.listSections();
    },
    async edit(id) {
      router.push("/interno/secao/cadastro/" + id);
    },
    async inactivate(id) {
      Swal.fire({
        title: "Você está certo disso?",
        text: "Deseja realmente excluir essa seção. Essa operação não poderá ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, pode seguir",
        cancelButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await SectionService.delete(id);
            AlertService.sucesso("Seção removida com sucesso!");
            await this.listSections();
          } catch (err) {
            console.log(err);
          }
        }
      });
    },    
    newReg() {
      router.push("/interno/secao/cadastro");
    },
  },
  async mounted() {
    await this.listSections();
    try {
      const resp = await SectionService.getFilterFields();
      this.fields = resp.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
