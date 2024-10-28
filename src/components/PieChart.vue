<template>
  <div>
    <GChart
      type="PieChart"
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
        ["Categoria", "Quantidade"],
        ["Eletrônicos", 11],
        ["Roupas", 2],
        ["Alimentos", 2],
        ["Móveis", 7],
        ["Outros", 5],
      ],
      chartOptions: {
        title: "Distribuição de Vendas por Categoria",
        is3D: true,
        pieHole: 0.4,
        colors: ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"],
        legend: { position: "bottom" },
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
