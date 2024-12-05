<template>
  <v-container>
    <v-expansion-panels v-model="painelAberto">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <h3>Filtros e Agrupamentos</h3>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card class="pa-4">
            <v-card-title>
              <h3>Filtros e Agrupamentos</h3>
            </v-card-title>

            <v-card-text>
              <v-form>
                <!-- Linha 1: Cliente e Elemento -->
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Cliente"
                      :items="clientes"
                      v-model="filtros.clienteId"
                      item-title="apelidoNomeFantasia"
                      item-value="clienteID"
                      @update:modelValue="changeCliente"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Elemento"
                      :items="elementos"
                      v-model="filtros.elemento"
                      item-title="valor"
                      item-value="item"
                    />
                  </v-col>
                </v-row>

                <!-- Linha 2 -->
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Fazenda"
                      :items="fazendas"
                      v-model="filtros.fazendas"
                      item-title="nome"
                      item-value="nome"
                      multiple
                      @update:modelValue="listarTalhoes"
                      :disabled="!filtros.clienteID && !filtros.elemento"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Talhão"
                      :items="talhoes"
                      v-model="filtros.talhoes"
                      item-title="nome"
                      item-value="nome"
                      multiple
                      @update:modelValue="listarGlebas"
                      :disabled="!filtros.clienteID && !filtros.elemento"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Gleba"
                      :items="glebas"
                      v-model="filtros.glebas"
                      item-title="nome"
                      item-value="nome"
                      multiple
                      @update:modelValue="listarPontos"
                      :disabled="!filtros.clienteID && !filtros.elemento"
                    />
                  </v-col>
                </v-row>

                <!-- Linha 3 -->
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Ponto de Coleta"
                      :items="pontos"
                      v-model="filtros.pontos"
                      item-title="nome"
                      item-value="nome"
                      multiple
                      @update:modelValue="listarProfundidades"
                      :disabled="!filtros.clienteID && !filtros.elemento"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Profundidade"
                      :items="profundidades"
                      v-model="filtros.profundidades"
                      item-title="nome"
                      item-value="nome"
                      multiple
                      :disabled="!filtros.clienteID && !filtros.elemento"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      label="Ano"
                      type="number"
                      v-model="filtros.ano"
                      :disabled="!filtros.clienteID && !filtros.elemento"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!-- Linha 4: Checkboxes e botão EXIBIR -->
                <v-row>
                  <v-col cols="12">
                    <div class="d-flex align-items-center flex-wrap">
                      <v-checkbox
                        v-for="agrupamento in agrupamentosDisponiveis"
                        :key="agrupamento.value"
                        v-model="agrupamentosSelecionados"
                        :label="agrupamento.label"
                        :value="agrupamento.value"
                        class="mr-4"
                        :disabled="!filtros.clienteID && !filtros.elemento"
                      />
                      <v-btn
                        color="primary"
                        class="ml-auto"
                        @click="buscarDadosDeFazendas"
                        :disabled="!filtros.clienteID && !filtros.elemento"
                      >
                        EXIBIR
                      </v-btn>
                    </div>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <!-- Gráficos -->
    <v-card v-if="showDashboard">
      <v-card-title><h3>Gráficos Gerados</h3></v-card-title>
      <v-card-text>
        <v-divider></v-divider>
        <v-row class="mt-5">
          <!-- Gráfico 1: Fazendas -->
          <v-col cols="12" md="6">
            <GChart
              type="ColumnChart"
              :data="graficoFazendasDados"
              :options="graficoFazendasOpcoes"
            />
          </v-col>

          <!-- Gráfico 2: Talhões -->
          <v-col cols="12" md="6">
            <GChart
              type="ColumnChart"
              :data="graficoTalhoesDados"
              :options="graficoTalhoesOpcoes"
            />
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <!-- Gráfico 3: Glebas -->
          <v-col cols="12" md="6">
            <GChart
              type="ColumnChart"
              :data="graficoGlebasDados"
              :options="graficoGlebasOpcoes"
            />
          </v-col>

          <!-- Gráfico 4: Pontos -->
          <v-col cols="12" md="6">
            <GChart
              type="ColumnChart"
              :data="graficoPontosDados"
              :options="graficoPontosOpcoes"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { GChart } from "vue-google-charts";
import CustomerService from "@/services/CustomerService";
import DashboardService from "@/services/DashboardService";

export default {
  components: {
    GChart,
  },
  data() {
    return {
      coresPorAno: {},
      painelAberto: [0],
      showDashboard: false,
      carregando: false,
      clientes: [],
      elementos: [
        { item: "pHH2O", valor: "pH H2O" },
        { item: "pHCaCl", valor: "pH CaCl" },
        { item: "pHSMP", valor: "pH SMP" },
        { item: "Pmeh", valor: "P meh" },
        { item: "Prem", valor: "P rem" },
        { item: "Pres", valor: "P res" },
        { item: "Ptotal", valor: "P total" },
        { item: "Na", valor: "Na" },
        { item: "K", valor: "K" },
        { item: "S", valor: "S" },
        { item: "Ca", valor: "Ca" },
        { item: "Mg", valor: "Mg" },
        { item: "Al", valor: "Al" },
        { item: "HplusAl", valor: "H + Al" },
        { item: "MO", valor: "MO" },
        { item: "CO", valor: "CO" },
        { item: "B", valor: "B" },
        { item: "Cu", valor: "Cu" },
        { item: "Fe", valor: "Fe" },
        { item: "Mn", valor: "Mn" },
        { item: "Zn", valor: "Zn" },
        { item: "SB", valor: "SB" },
        { item: "CTCEfetiva", valor: "t" },
        { item: "CTCTotal", valor: "T" },
        { item: "V", valor: "V" },
        { item: "m", valor: "m" },
        { item: "CaMg", valor: "Ca/Mg" },
        { item: "CaK", valor: "Ca/K" },
        { item: "MgK", valor: "Mg/K" },
        { item: "CaplusMgK", valor: "(Ca+Mg)/K" },
        { item: "CaCTCEfetiva", valor: "Ca/t" },
        { item: "MgCTCEfetiva", valor: "Mg/t" },
        { item: "CaCTCTotal", valor: "Ca/T" },
        { item: "MgCTCTotal", valor: "Mg/T" },
        { item: "KT", valor: "K/T" },
        { item: "NaT", valor: "Na/T" },
        { item: "HplusAlT", valor: "(H+Al)/T" },
        { item: "CaplusMgT", valor: "(Ca+Mg)/T" },
        { item: "CaplusMgplusKT", valor: "(Ca+Mg+K)/T" },
        { item: "CaplusMgplusKplusNaT", valor: "(Ca+Mg+K+Na)/T" },
        { item: "Argila", valor: "Argila" },
        { item: "Silite", valor: "Silte" },
        { item: "AreiaTotal", valor: "Areia Total" },
        { item: "AreiaGrossa", valor: "Areia Grossa" },
        { item: "AreiaFina", valor: "Areia Fina" },
      ],
      filtros: {
        clienteId: null,
        elemento: "",
        fazendas: [],
        talhoes: [],
        glebas: [],
        profundidades: [],
        pontos: [],
        ano: "2024",
      },
      fazendas: [],
      talhoes: [],
      glebas: [],
      pontos: [],
      profundidades: [],
      agrupamentosDisponiveis: [
        { label: "Fazenda", value: "fazenda" },
        { label: "Talhão", value: "talhao" },
        { label: "Gleba", value: "gleba" },
        { label: "Ponto de Coleta", value: "pontoColeta" },
        { label: "Profundidade", value: "profundidade" },
        { label: "Ano", value: "ano" },
      ],
      agrupamentosSelecionados: [],
      // Gráficos
      graficoFazendasDados: [],
      graficoTalhoesDados: [],
      graficoGlebasDados: [],
      graficoPontosDados: [],
      graficoFazendasOpcoes: {
        title: "Valores por Fazenda",
        hAxis: { title: "Fazendas" },
        vAxis: { title: "Valor" },
        legend: { position: "none" },
      },
      graficoTalhoesOpcoes: {
        title: "Valores por Talhão",
        hAxis: { title: "Talhões" },
        vAxis: { title: "Valor" },
        legend: { position: "none" },
      },
      graficoGlebasOpcoes: {
        title: "Valores por Gleba",
        hAxis: { title: "Talhões" },
        vAxis: { title: "Valor" },
        legend: { position: "none" },
      },
      graficoPontosOpcoes: {
        title: "Valores por Ponto",
        hAxis: { title: "Pontos" },
        vAxis: { title: "Valor" },
        legend: { position: "none" },
      },
    };
  },
  methods: {
    async listarClientes() {
      try {
        const resp = await CustomerService.listAll();
        this.clientes = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    async changeCliente() {
      this.filtros = {
        clienteId: this.filtros.clienteId,
        elemento: this.filtros.elemento,
        fazendas: [],
        talhoes: [],
        glebas: [],
        profundidades: [],
        pontos: [],
        ano: "2024",
      };

      this.talhoes = [];
      this.glebas = [];
      this.pontos = [];
      this.profundidades = [];

      this.listarFazendas();
    },
    async listarFazendas() {
      try {
        const resp = await DashboardService.getFazendas(this.filtros);
        this.fazendas = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    async listarTalhoes() {
      try {
        const resp = await DashboardService.getTalhoes(this.filtros);
        this.talhoes = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    async listarGlebas() {
      try {
        const resp = await DashboardService.getGlebas(this.filtros);
        this.glebas = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    async listarPontos() {
      try {
        const resp = await DashboardService.getPontos(this.filtros);
        this.pontos = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    async listarProfundidades() {
      try {
        const resp = await DashboardService.getProfundidades(this.filtros);
        this.profundidades = resp.data;
      } catch (error) {
        console.log(error);
      }
    },
    gerarCorAleatoria() {
      return `#${Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0")}`;
    },
    obterCorPorAno(ano) {
      if (!this.coresPorAno[ano]) {
        // Gera uma cor aleatória apenas se ainda não existir para o ano
        this.coresPorAno[ano] = `#${Math.floor(Math.random() * 16777215)
          .toString(16)
          .padStart(6, "0")}`;
      }
      return this.coresPorAno[ano];
    },
    async simularChamadaAPI(endpoint, params) {
      console.log(`Simulando chamada para ${endpoint} com`, params);
      return new Promise((resolve) => {
        setTimeout(() => {
          if (endpoint === "fazendas") {
            resolve([
              [
                "Fazenda",
                "2022",
                { role: "style" },
                "2023",
                { role: "style" },
                "2024",
                { role: "style" },
              ],
              [
                "Fazenda A",
                120,
                this.obterCorPorAno("2022"),
                140,
                this.obterCorPorAno("2023"),
                160,
                this.obterCorPorAno("2024"),
              ],
              [
                "Fazenda B",
                90,
                this.obterCorPorAno("2022"),
                110,
                this.obterCorPorAno("2023"),
                130,
                this.obterCorPorAno("2024"),
              ],
              [
                "Fazenda C",
                60,
                this.obterCorPorAno("2022"),
                80,
                this.obterCorPorAno("2023"),
                100,
                this.obterCorPorAno("2024"),
              ],
            ]);
          }
          if (endpoint === "talhoes") {
            resolve([
              [
                "Talhão",
                "2022",
                { role: "style" },
                "2023",
                { role: "style" },
                "2024",
                { role: "style" },
              ],
              [
                "Talhão 1",
                50,
                this.obterCorPorAno("2022"),
                70,
                this.obterCorPorAno("2023"),
                90,
                this.obterCorPorAno("2024"),
              ],
              [
                "Talhão 2",
                30,
                this.obterCorPorAno("2022"),
                50,
                this.obterCorPorAno("2023"),
                70,
                this.obterCorPorAno("2024"),
              ],
              [
                "Talhão 3",
                70,
                this.obterCorPorAno("2022"),
                90,
                this.obterCorPorAno("2023"),
                110,
                this.obterCorPorAno("2024"),
              ],
            ]);
          }
          if (endpoint === "glebas") {
            resolve([
              [
                "Gleba",
                "2022",
                { role: "style" },
                "2023",
                { role: "style" },
                "2024",
                { role: "style" },
              ],
              [
                "Gleba A",
                175,
                this.obterCorPorAno("2022"),
                190,
                this.obterCorPorAno("2023"),
                210,
                this.obterCorPorAno("2024"),
              ],
              [
                "Gleba B",
                47,
                this.obterCorPorAno("2022"),
                65,
                this.obterCorPorAno("2023"),
                75,
                this.obterCorPorAno("2024"),
              ],
              [
                "Gleba C",
                250,
                this.obterCorPorAno("2022"),
                270,
                this.obterCorPorAno("2023"),
                300,
                this.obterCorPorAno("2024"),
              ],
            ]);
          }
          if (endpoint === "pontos") {
            resolve([
              [
                "Ponto",
                "2022",
                { role: "style" },
                "2023",
                { role: "style" },
                "2024",
                { role: "style" },
              ],
              [
                "Ponto X",
                22,
                this.obterCorPorAno("2022"),
                45,
                this.obterCorPorAno("2023"),
                67,
                this.obterCorPorAno("2024"),
              ],
              [
                "Ponto Y",
                85,
                this.obterCorPorAno("2022"),
                90,
                this.obterCorPorAno("2023"),
                100,
                this.obterCorPorAno("2024"),
              ],
              [
                "Ponto Z",
                96,
                this.obterCorPorAno("2022"),
                110,
                this.obterCorPorAno("2023"),
                120,
                this.obterCorPorAno("2024"),
              ],
            ]);
          }
        }, 1000);
      });
    },
    async buscarDadosDeFazendas() {
      this.graficoFazendasDados = [];
      this.graficoFazendasDados = await this.simularChamadaAPI("fazendas", {
        filtros: this.filtros,
      });
      this.buscarDadosDeTalhoes();
    },
    async buscarDadosDeTalhoes() {
      this.graficoTalhoesDados = [];
      this.graficoTalhoesDados = await this.simularChamadaAPI("talhoes", {
        filtros: this.filtros,
      });
      this.buscarDadosDeGlebas();
    },
    async buscarDadosDeGlebas() {
      this.graficoGlebasDados = [];
      this.graficoGlebasDados = await this.simularChamadaAPI("glebas", {
        filtros: this.filtros,
      });
      this.buscarDadosDePontos();
    },
    async buscarDadosDePontos() {
      this.graficoPontosDados = [];
      this.graficoPontosDados = await this.simularChamadaAPI("pontos", {
        filtros: this.filtros,
      });
      this.painelAberto = [];
      this.showDashboard = true;
    },
  },
  mounted() {
    this.listarClientes();
  },
};
</script>

<style scoped>
.mr-4 {
  margin-right: 16px;
}
.ml-auto {
  margin-left: auto;
}
</style>
