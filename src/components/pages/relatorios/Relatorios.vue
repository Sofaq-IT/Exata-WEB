<template>
  <v-card>
    <v-card-title>Relatórios</v-card-title>
    <v-card-text>
      <v-divider></v-divider>
      <v-row class="mt-5">
        <v-col
          cols="12"
          md="6"
          v-for="(tipo, index) in tiposRelatorios"
          :key="index"
        >
          <v-btn
            variant="outlined"
            color="secondary"
            size="small"
            class="w-100"
            style="min-height: 50px"
            @click="abrirFiltros(index)"
            >{{ tipo.title }}</v-btn
          >
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="showFiltros" style="width: 750px">
    <v-card>
      <v-card-title>{{
        tiposRelatorios.find((item) => item.selecionado).title
      }}</v-card-title>
      <v-card-text style="min-height: 200px">
        <v-form ref="formValidacao">
          <v-divider></v-divider>
          <v-row>
            <v-col cols="12">
              <v-select
                :items="empresas"
                v-model="filtros.empresaId"
                item-title="apelidoNomeFantasia"
                item-value="empresaID"
                placeholder="Selecione uma empresa"
                :rules="requiredRules"
                label="Empresa"
              >
              </v-select>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" md="6">
              <v-date-input
                readonly
                v-model="filtros.dataInicio"
                label="Início"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                v-mask="'##/##/####'"
                :rules="requiredRules"
              ></v-date-input>
            </v-col>
            <v-col cols="12" md="6">
              <v-date-input
                readonly
                v-model="filtros.dataFim"
                label="Fim"
                prepend-icon=""
                prepend-inner-icon="$calendar"
                v-mask="'##/##/####'"
                :rules="requiredRules"
              ></v-date-input>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-btn color="primary" class="w-100" @click="gerarRelatorio"
                >Gerar Relatório</v-btn
              >
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import { VDateInput } from "vuetify/labs/VDateInput";
import * as XLSX from "xlsx";
import AlertService from "@/plugins/alerts";
import CompanyService from "@/services/CompanyService";
import ReportService from "@/services/ReportService";
export default {
  name: "Relatórios",
  components: {
    VDateInput,
  },
  data() {
    return {
      showFiltros: false,
      empresas: [],
      tiposRelatorios: [
        { title: "Informações dos Clientes", selecionado: false, id: 1 },
        {
          title: "Quantidade de Amostras por Cliente",
          selecionado: false,
          id: 2,
        },
        { title: "Planos dos Clientes", selecionado: false, id: 3 },
        {
          title: "Quantidade de Amostras por Plano",
          selecionado: false,
          id: 4,
        },
      ],
      requiredRules: [(v) => !!v || "Campo obrigatório"],
      filtros: {
        empresaId: null,
        dataInicio: null,
        dataFim: null,
      },
    };
  },
  methods: {
    abrirFiltros(index) {
      this.tiposRelatorios.forEach((item) => {
        item.selecionado = false;
      });
      this.tiposRelatorios[index].selecionado = true;
      this.showFiltros = true;
    },
    async listCompanies() {
      try {
        const resp = await CompanyService.listAll();
        this.empresas = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    async gerarRelatorio() {
      const validation = await this.$refs.formValidacao.validate();
      if (validation.valid) {
        const relatorioSelecionado = this.tiposRelatorios.find(
          (x) => x.selecionado
        ).id;

        let dadosRelatorios;

        switch (relatorioSelecionado) {
          case 1:
            dadosRelatorios = await ReportService.getInformacaoClientes(
              this.filtros
            );
            break;
          case 2:
            dadosRelatorios = await ReportService.getAmostraClientes(
              this.filtros
            );
            break;
          case 3:
            dadosRelatorios = await ReportService.getPlanoClientes(
              this.filtros
            );
            break;
          case 4:
            dadosRelatorios = await ReportService.getAmostraPlanos(
              this.filtros
            );
            break;
        }

        this.showFiltros = false;

        if (dadosRelatorios.data) this.exportarParaExcel(dadosRelatorios.data);
        else
          AlertService.info(
            "Não foram encontradas informações com os filtros informados."
          );
      }
    },
    exportarParaExcel(dados) {
      // Cria uma nova planilha de dados
      const ws = XLSX.utils.json_to_sheet(dados);
      // Cria uma nova pasta de trabalho
      const wb = XLSX.utils.book_new();
      // Adiciona a planilha à pasta de trabalho
      XLSX.utils.book_append_sheet(wb, ws, "Dados");
      // Gera o arquivo Excel e aciona o download
      XLSX.writeFile(wb, "dados.xlsx");

      AlertService.sucesso("Relatório gerado com sucesso!");
    },
  },
  async mounted() {
    this.listCompanies();
  },
};
</script>
