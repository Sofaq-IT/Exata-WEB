<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <DataTable
          :items="items"
          :title="title"
          :filters="fields"
          :showSearch="true"
          :footer="paginacaoResponse"
          :showEdit="true"
          :showInactivate="true"
          :showPermission="true"
          @updateFilter:filter="updateFilter"
          @updateFooter:fields="updateFooter"
          @edit:id="edit"
          @inactivate:id="inactivate"
          @permissions:id="permissions"
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
import ContactService from "@/services/ContactService";

export default {
  name: "Contact",
  components: {
    DataTable,
  },
  data() {
    return {
      items: [],
      headers: [],
      title: "Contatos Cadastrados",
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
      fields: [],
    };
  },
  methods: {
    async listContacts() {
      try {
        const resp = await ContactService.list(this.paginacaoRequest);

        this.paginacaoResponse = JSON.parse(resp.headers["x-paginacao"]);

        this.items = resp.data.map((x) => ({
          Ativo: x.ativo,
          Nome: x.nome,
          Telefone: x.telefoneID,
          DataCadastro: x.dataCadastroFormatada,
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
      await this.listContacts();
    },
    async updateFooter(data) {
      this.paginacaoRequest.pagina = data.page;
      this.paginacaoRequest.registroPorPagina = data.qtyItems;
      await this.listContacts();
    },
    async permissions(id) {
      router.push("/interno/contato/tipo/" + id);
    },
    async edit(id) {
      router.push("/interno/contato/cadastro/" + id);
    },
    async inactivate(id) {
      Swal.fire({
        title: "Você está certo disso?",
        text: "Deseja realmente excluir esse contato. Essa operação não poderá ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, pode seguir",
        cancelButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await ContactService.delete(id);
            AlertService.sucesso("Contato removido com sucesso!");
            await this.listContacts();
          } catch (err) {
            console.log(err);
          }
        }
      });
    },
    newReg() {
      router.push("/interno/contato/cadastro");
    },
  },
  async mounted() {
    await this.listContacts();
    try {
      const resp = await ContactService.getFilterFields();
      this.fields = resp.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
