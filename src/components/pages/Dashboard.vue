<template>
  <v-row>
    <v-col>
      <v-card color="warning">
        <v-card-text class="text-center">
          <h1>1</h1>
          <v-divider></v-divider>
          <p class="mt-5">Information I</p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card color="red">
        <v-card-text class="text-center">
          <h1>2</h1>
          <v-divider></v-divider>
          <p class="mt-5">Information II</p>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card color="success">
        <v-card-text class="text-center">
          <h1>3</h1>
          <v-divider></v-divider>
          <p class="mt-5">Information III</p>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text class="text-center">
          <h2>Chart I</h2>
          <v-divider></v-divider>
          <LineChart />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card>
        <v-card-text class="text-center">
          <h2>Chart II</h2>
          <v-divider></v-divider>
           <PieChart />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
  <v-row>
    <v-col>
      <v-card>
        <v-card-text class="text-center">
          <h2>Chart III</h2>
          <v-divider></v-divider>
          <BarChart />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col>
      <v-card>
        <v-card-text class="text-center">
          <h2>Chart IV</h2>
          <v-divider></v-divider>
           <MapChart />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import LineChart from "../LineChart.vue";
import PieChart from "../PieChart.vue";
import BarChart from "../BarChart.vue";
import MapChart from "../MapChart.vue";

export default {
  components: {
    LineChart,
    PieChart,
    BarChart,
    MapChart
  },
};
</script>
