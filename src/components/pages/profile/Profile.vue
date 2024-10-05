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
import ProfileService from "@/services/ProfileService";

export default {
  name: "Profile",
  components: {
    DataTable,
  },
  data() {
    return {
      items: [],
      headers: [],
      title: "Perfis Cadastrados",
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
    async listProfiles() {
      try {
        const resp = await ProfileService.list(this.paginacaoRequest);

        this.paginacaoResponse = JSON.parse(resp.headers["x-paginacao"]);

        this.items = resp.data.map((x) => ({
          Ativo: x.ativo,
          Descricao: x.descricao,
          DataCadastro: x.dataCadastroFormatada,
          Id: x.perfilID,
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
      await this.listProfiles();
    },
    async updateFooter(data) {
      this.paginacaoRequest.pagina = data.page;
      this.paginacaoRequest.registroPorPagina = data.qtyItems;
      await this.listProfiles();
    },
    async permissions(id) {
      router.push("/interno/perfil/permissoes/" + id);
    },
    async edit(id) {
      router.push("/interno/perfil/cadastro/" + id);
    },
    async inactivate(id) {
      Swal.fire({
        title: "Você está certo disso?",
        text: "Deseja realmente excluir esse perfil. Essa operação não poderá ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, pode seguir",
        cancelButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await ProfileService.delete(id);
            AlertService.sucesso("Perfil removido com sucesso!");
            await this.listProfiles();
          } catch (err) {
            console.log(err);
          }
        }
      });
    },
    newReg() {
      router.push("/interno/perfil/cadastro");
    },
  },
  async mounted() {
    await this.listProfiles();
    try {
      const resp = await ProfileService.getFilterFields();
      this.fields = resp.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
