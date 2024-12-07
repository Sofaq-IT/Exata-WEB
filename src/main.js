// Plugins
import {
  registerPlugins
} from '@/plugins'

// Components
import App from './App.vue'
import router from './router';
import VueTheMask from 'vue-the-mask';
import store from './plugins/store';

// Composables
import {
  createApp
} from 'vue'

const app = createApp(App)

import {
  Chart,
  RadarController, // Adicionado
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// Registro Global dos Componentes do Chart.js
Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

import './assets/styles.css';

app.use(router);
app.use(VueTheMask);
app.use(store)

registerPlugins(app)

app.mount('#app')
