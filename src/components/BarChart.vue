<template>
  <div>
    <GChart
      type="BarChart"
      :data="chartData"
      :options="chartOptions"
      :settings="chartSettings"
    />
  </div>
</template>

<script>
import { GChart } from "vue-google-charts";

export default {
  components: {
    GChart,
  },
  data() {
    return {
      chartData: [
        ["Ano", "Vendas", "Despesas"],
        ["2019", 1000, 400],
        ["2020", 1170, 460],
        ["2021", 660, 1120],
        ["2022", 1030, 540],
      ],
      chartOptions: {
        title: "Desempenho Anual de Vendas e Despesas",
        hAxis: {
          title: "Ano",
        },
        vAxis: {
          title: "Quantidade (R$)",
        },
        bars: "horizontal", // Muda para gráfico de barras horizontal
        colors: ["#1E88E5", "#D32F2F"],
        legend: { position: "top", alignment: "center" },
      },
      chartSettings: {
        packages: ["corechart"],
      },
    };
  },
};
</script>

<style scoped>
/* Estilos adicionais para o gráfico, se necessário */
</style>
