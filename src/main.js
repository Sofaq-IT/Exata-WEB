// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'
import router from './router';
import VueTheMask from 'vue-the-mask';
import store from './plugins/store';

// Composables
import { createApp } from 'vue'

const app = createApp(App)

app.use(router);
app.use(VueTheMask);
app.use(store)

registerPlugins(app)

app.mount('#app')
