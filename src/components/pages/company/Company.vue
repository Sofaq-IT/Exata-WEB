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
          @updateFilter:filter="updateFilter"
          @updateFooter:fields="updateFooter"
          @edit:id="edit"
          @inactivate:id="inactivate"
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
import CompanyService from "@/services/CompanyService";

export default {
  name: "Company",
  components: {
    DataTable,
  },
  data() {
    return {
      items: [],
      headers: [],
      title: "Empresas Cadastradas",
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
    async listCompanies() {
      try {
        const resp = await CompanyService.list(this.paginacaoRequest);

        this.paginacaoResponse = JSON.parse(resp.headers["x-paginacao"]);

        this.items = resp.data.map((x) => ({
          Ativo: x.ativo,
          Tipo: x.fisicaJuridica == "F" ? "Física" : "Jurídica",
          "CPF / CNPJ": this.formatCpfCnpj(x.cpfCnpj),
          "Apelido / Nome Fantasia": x.apelidoNomeFantasia,
          Id: x.empresaID,
          "Nome / Razão Social": x.nomeRazaoSocial,
          "Data de Cadastro": x.dataCadastroFormatada,
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
      await this.listCompanies();
    },
    async updateFooter(data) {
      this.paginacaoRequest.pagina = data.page;
      this.paginacaoRequest.registroPorPagina = data.qtyItems;
      await this.listCompanies();
    },
    async edit(id) {
      router.push("/interno/empresa/cadastro/" + id);
    },
    async inactivate(id) {
      Swal.fire({
        title: "Você está certo disso?",
        text: "Deseja realmente excluir essa empresa. Essa operação não poderá ser desfeita.",
        showCancelButton: true,
        confirmButtonText: "Sim, pode seguir",
        cancelButtonText: `Cancelar`,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await CompanyService.delete(id);
            AlertService.sucesso("Empresa removido com sucesso!");
            await this.listCompanies();
          } catch (err) {
            console.log(err);
          }
        }
      });
    },
    newReg() {
      router.push("/interno/empresa/cadastro");
    },
    formatCpfCnpj(value) {
      // Remove todos os caracteres não numéricos
      value = value.replace(/\D/g, "");

      if (value.length <= 11) {
        // Formatar como CPF
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else {
        // Formatar como CNPJ
        return value.replace(
          /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
          "$1.$2.$3/$4-$5"
        );
      }
    },
  },
  async mounted() {
    await this.listCompanies();
    try {
      const resp = await CompanyService.getFilterFields();
      this.fields = resp.data;
    } catch (error) {
      console.log(error);
    }
  },
};
</script>

<style scoped>
table thead,
tbody tr th,
td {
  font-size: 10px;
}
</style>