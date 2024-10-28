<template>
  <div>
    <GChart
      type="LineChart"
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
        ["Mês", "Vendas"],
        ["Janeiro", 1000],
        ["Fevereiro", 1170],
        ["Março", 660],
        ["Abril", 1030],
      ],
      chartOptions: {
        title: "Vendas Mensais",
        curveType: "function",
        legend: { position: "bottom" },
        hAxis: {
          title: "Mês",
        },
        vAxis: {
          title: "Vendas (R$)",
        },
        colors: ["#4285F4"],
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
