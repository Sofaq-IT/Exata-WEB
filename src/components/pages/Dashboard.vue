<template>
  <v-container>
    <v-expansion-panels v-model="painelAberto" class="mb-5">
      <v-expansion-panel>
        <v-expansion-panel-title>
          <h3>Filtros e Agrupamentos</h3>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card class="pa-4">
            <v-card-text>
              <v-form>
                <h2>Filtros</h2>
                <v-divider></v-divider>
                <!-- Linha 1: Cliente e Elemento -->
                <v-row class="mt-5">
                  <v-col cols="12" md="4">
                    <v-select
                      label="Cliente"
                      :items="clientes"
                      v-model="filtros.clienteId"
                      item-title="apelidoNomeFantasia"
                      item-value="clienteID"
                      @update:modelValue="changeCliente"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Elemento"
                      :items="elementos"
                      v-model="filtros.elemento"
                      item-title="valor"
                      item-value="item"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-select
                      label="Anos"
                      :items="anos"
                      v-model="anosSelecionados"
                      item-title="ano"
                      item-value="ano"
                      multiple
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
                </v-row>

                <h2>Quais Gráficos exibir?</h2>
                <v-divider></v-divider>
                <v-row class="mt-5">
                  <v-col cols="12">
                    <div class="d-flex align-items-center flex-wrap">
                      <v-checkbox
                        v-for="g in graficosDisponiveis"
                        :key="g.label"
                        v-model="g.checked"
                        :label="g.label"
                        :value="g.label"
                        class="mr-4"
                        :disabled="!filtros.clienteID && !filtros.elemento"
                      />
                      <v-btn
                        color="primary"
                        class="ml-auto"
                        @click="preencherDashboards"
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
          <v-col
            cols="12"
            v-if="graficosDisponiveis.find((x) => x.label === 'Radar').checked"
          >
            <canvas id="radarChart"></canvas>
          </v-col>

          <!-- Gráfico 1: Fazendas -->
          <v-col
            cols="6"
            v-if="
              graficosDisponiveis.find((x) => x.label === 'Fazenda').checked
            "
          >
            <GChart
              type="ColumnChart"
              :data="graficoFazendasDados"
              :options="graficoFazendasOpcoes"
              :events="chartEvents"
            />
          </v-col>

          <!-- Gráfico 2: Talhões -->
          <v-col
            cols="6"
            v-if="graficosDisponiveis.find((x) => x.label === 'Talhão').checked"
          >
            <GChart
              type="ColumnChart"
              :data="graficoTalhoesDados"
              :options="graficoTalhoesOpcoes"
            />
          </v-col>
        </v-row>
        <v-row class="mt-5">
          <!-- Gráfico 3: Glebas -->
          <v-col
            cols="6"
            v-if="graficosDisponiveis.find((x) => x.label === 'Gleba').checked"
          >
            <GChart
              type="ColumnChart"
              :data="graficoGlebasDados"
              :options="graficoGlebasOpcoes"
            />
          </v-col>

          <!-- Gráfico 4: Pontos -->
          <v-col
            cols="6"
            v-if="graficosDisponiveis.find((x) => x.label === 'Ponto').checked"
          >
            <GChart
              type="ColumnChart"
              :data="graficoPontosDados"
              :options="graficoPontosOpcoes"
            />
          </v-col>

          <!-- Gráfico 5: Profundidades -->
          <v-col
            cols="6"
            v-if="
              graficosDisponiveis.find((x) => x.label === 'Profundidade')
                .checked
            "
          >
            <GChart
              type="ColumnChart"
              :data="graficoProfundidadesDados"
              :options="graficoProfundidadesOpcoes"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-alert type="info" elevation="2" border="start" v-else>
      Sem dados para exibir com os filtros selecionados
    </v-alert>
  </v-container>
</template>

<script>
import { GChart } from "vue-google-charts";
import { Chart } from "chart.js";
import CustomerService from "@/services/CustomerService";
import DashboardService from "@/services/DashboardService";

export default {
  components: {
    GChart,
    Chart,
  },
  data() {
    return {
      chartEvents: {
        select: () => {},
      },
      radarChart: null, // Instância do gráfico de radar
      radarTitle: "", // Título dinâmico do gráfico de radar
      coresPorAno: [],
      painelAberto: [],
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
        ano: "",
      },
      fazendas: [],
      talhoes: [],
      glebas: [],
      pontos: [],
      profundidades: [],
      graficosDisponiveis: [
        { label: "Radar", checked: false },
        { label: "Fazenda", checked: false },
        { label: "Talhão", checked: false },
        { label: "Gleba", checked: false },
        { label: "Ponto", checked: false },
        { label: "Profundidade", checked: false },
      ],
      agrupamentosDisponiveis: [{ label: "Agrupar por Ano", value: "ano" }],
      agrupamentosSelecionados: [],
      // Gráficos
      graficoFazendasDados: [],
      graficoTalhoesDados: [],
      graficoGlebasDados: [],
      graficoPontosDados: [],
      graficoProfundidadesDados: [],
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
        hAxis: { title: "Glebas" },
        vAxis: { title: "Valor" },
        legend: { position: "none" },
      },
      graficoPontosOpcoes: {
        title: "Valores por Ponto",
        hAxis: { title: "Pontos" },
        vAxis: { title: "Valor" },
        legend: { position: "none" },
      },
      graficoProfundidadesOpcoes: {
        title: "Valores por Profundidade",
        hAxis: { title: "Profundidades" },
        vAxis: { title: "Valor" },
        legend: { position: "none" },
      },
      anos: [],
      anosSelecionados: [],
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
        ano: "",
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
    async preencherDashboards() {
      if (this.anosSelecionados.length === 0) {
        this.showDashboard = false;
        this.painelAberto = [];
        return;
      }
      this.anosSelecionados.sort();
      this.preencherColunasGraficos();
      this.preencherTitulosGraficos();

      try {
        const resp = await DashboardService.getDashboard(this.filtros);

        if (resp.data.fazendas.length > 0) {
          if (this.anosSelecionados.length > 0) {
            this.agruparInformacoes(resp.data);
          } else {
            this.agruparInformacoesSemAno(resp.data);
          }
          this.initRadarChart(`Gráfico Radar`);
        } else {
          this.showDashboard = false;
          this.painelAberto = [];
        }
      } catch (error) {
        console.log(error);
      }
    },
    preencherColunasGraficos() {
      const colunas = [
        "Categoria",
        ...this.anosSelecionados.map((ano) => ano.toString()),
      ];
      this.graficoFazendasDados = [colunas];
      this.graficoTalhoesDados = [colunas];
      this.graficoGlebasDados = [colunas];
      this.graficoPontosDados = [colunas];
      this.graficoProfundidadesDados = [colunas];
    },

    preencherTitulosGraficos() {
      this.graficoFazendasOpcoes.title =
        "Valores por Fazenda - " + this.filtros.elemento;

      this.graficoTalhoesOpcoes.title =
        "Valores por Talhão - " + this.filtros.elemento;

      this.graficoGlebasOpcoes.title =
        "Valores por Gleba - " + this.filtros.elemento;

      this.graficoPontosOpcoes.title =
        "Valores por Ponto - " + this.filtros.elemento;

      this.graficoProfundidadesOpcoes.title =
        "Valores por Profundidade - " + this.filtros.elemento;
    },
    agruparInformacoes(data) {
      const obterValoresPorAno = (anos) => {
        return this.anosSelecionados.map((ano) => {
          const anoData = anos.find(
            (a) => a.nome.toString() === ano.toString()
          );
          return anoData ? anoData.valor : 0; // Preenche com 0 se o ano não existir
        });
      };

      data.fazendas.forEach((fazenda) => {
        let valoresFazenda = this.anosSelecionados.map(() => 0);

        fazenda.talhoes.forEach((talhao) => {
          let valoresTalhao = this.anosSelecionados.map(() => 0);

          talhao.glebas.forEach((gleba) => {
            let valoresGleba = this.anosSelecionados.map(() => 0);

            gleba.pontos.forEach((ponto) => {
              let valoresPonto = this.anosSelecionados.map(() => 0);

              ponto.profundidades.forEach((profundidade) => {
                const valoresProfundidade = obterValoresPorAno(
                  profundidade.anos
                );

                // Adicionar dados ao gráfico de profundidades
                this.graficoProfundidadesDados.push([
                  profundidade.nome,
                  ...valoresProfundidade,
                ]);

                // Somar os valores por ano
                valoresPonto = valoresPonto.map(
                  (v, index) => v + valoresProfundidade[index]
                );
              });

              this.graficoPontosDados.push([ponto.nome, ...valoresPonto]);
              valoresGleba = valoresGleba.map(
                (v, index) => v + valoresPonto[index]
              );
            });

            this.graficoGlebasDados.push([gleba.nome, ...valoresGleba]);
            valoresTalhao = valoresTalhao.map(
              (v, index) => v + valoresGleba[index]
            );
          });

          this.graficoTalhoesDados.push([talhao.nome, ...valoresTalhao]);
          valoresFazenda = valoresFazenda.map(
            (v, index) => v + valoresTalhao[index]
          );
        });

        this.graficoFazendasDados.push([fazenda.nome, ...valoresFazenda]);
      });

      this.showDashboard = true;
      this.painelAberto = [];
    },
    agruparInformacoesSemAno(data) {
      data.fazendas.forEach((fazenda) => {
        let totalFazenda = 0;

        fazenda.talhoes.forEach((talhao) => {
          let totalTalhao = 0;

          talhao.glebas.forEach((gleba) => {
            let totalGleba = 0;

            gleba.pontos.forEach((ponto) => {
              let totalPonto = 0;

              ponto.profundidades.forEach((profundidade) => {
                let totalProfundidade = 0;

                profundidade.anos.forEach((ano) => {
                  totalProfundidade += ano.valor;
                });

                // Adicionar dados do gráfico de profundidades
                this.graficoProfundidadesDados.push([
                  profundidade.nome,
                  totalProfundidade,
                  this.obterCorPorAno(this.filtros.ano),
                ]);

                totalPonto += totalProfundidade;
              });

              // Adicionar dados do gráfico de pontos
              this.graficoPontosDados.push([
                ponto.nome,
                totalPonto,
                this.obterCorPorAno(this.filtros.ano),
              ]);

              totalGleba += totalPonto;
            });

            // Adicionar dados do gráfico de glebas
            this.graficoGlebasDados.push([
              gleba.nome,
              totalGleba,
              this.obterCorPorAno(this.filtros.ano),
            ]);

            totalTalhao += totalGleba;
          });

          // Adicionar dados do gráfico de talhões
          this.graficoTalhoesDados.push([
            talhao.nome,
            totalTalhao,
            this.obterCorPorAno(this.filtros.ano),
          ]);

          totalFazenda += totalTalhao;
        });

        // Adicionar dados do gráfico de fazendas
        this.graficoFazendasDados.push([
          fazenda.nome,
          totalFazenda,
          this.obterCorPorAno(this.filtros.ano),
        ]);
      });

      this.showDashboard = true;
      this.painelAberto = [];
    },

    getYearsFromPast24() {
      const currentYear = new Date().getFullYear(); // Obtém o ano atual
      const startYear = currentYear - 24; // Calcula o ano inicial (24 anos atrás)
      const years = [];

      for (let year = startYear; year <= currentYear; year++) {
        years.push(year);
      }

      this.anos = years;
      this.anosSelecionados.push(2024);
    },
    async initRadarChart(title) {
      this.radarTitle = title; // Atualiza o título do gráfico
      this.showRadar = true; // Mostra o modal do gráfico de Radar

      const resp = await DashboardService.getRadar(this.filtros);
      const labels = Object.keys(resp.data).filter((key) => resp.data[key] > 0);
      const values = Object.values(resp.data).filter((key) => key > 0);

      this.$nextTick(() => {
        const ctx = document.getElementById("radarChart").getContext("2d");

        if (this.radarChart) {
          this.radarChart.destroy(); // Destroi o gráfico anterior, se existir
        }

        this.radarChart = new Chart(ctx, {
          type: "radar",
          data: {
            labels: labels, // Eixos do radar
            datasets: [
              {
                label: "Gráfico de Radar",
                data: values, // Valores do radar
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true,
                position: "top",
              },
            },
            scales: {
              r: {
                ticks: {
                  beginAtZero: true,
                },
              },
            },
          },
        });
      });
    },
    closeRadar() {
      this.showRadar = false; // Fecha o modal do Radar
    },
  },
  mounted() {
    this.listarClientes();
    this.getYearsFromPast24();
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
