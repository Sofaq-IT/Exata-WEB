<template>
  <div>
    <GChart
      type="GeoChart"
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
        ["Região", "Acessos"],
        ["Brasil", 1000],
        ["Estados Unidos", 1170],
        ["Canadá", 660],
        ["Reino Unido", 530],
        ["Alemanha", 750],
        // Valores fictícios para continentes
        ["África do Sul", 10],    // África
        ["China", 20],            // Ásia
        ["França", 30],           // Europa
        ["Austrália", 40],        // Oceania
      ],
      chartOptions: {
        title: "Acessos por País e Continente",
        colorAxis: {
          colors: ["#FFD700", "#FF4500", "#32CD32", "#1E90FF"], // Cores distintas para cada continente
          values: [10, 20, 30, 40], // Valores correspondentes para colorir continentes específicos
        },
        legend: { position: "bottom" },
        backgroundColor: "#f5f5f5",
        height: 300,
        datalessRegionColor: "#e0e0e0",
        defaultColor: "#c1c1c1",
      },
      chartSettings: {
        packages: ["geochart"],
        mapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Substitua pela sua chave de API do Google Maps
      },
    };
  },
};
</script>

<style scoped>
/* Estilos adicionais para o gráfico, se necessário */
</style>
