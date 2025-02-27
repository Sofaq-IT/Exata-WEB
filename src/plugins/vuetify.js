import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import store from './store'

const vuetify = createVuetify({
  theme: {
    defaultTheme: store.state.isDark ? 'dark' : 'light',
    themes: {
      light: {
        primary: '#1976D2',
        secondary: '#424242',
        accent: '#82B1FF',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107',
      },
      dark: {
        primary: '#2196F3',
        secondary: '#424242',
        accent: '#FF4081',
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FB8C00',
      },
    },
  },
  date: {
    locale: {
      en: 'pt-BR',
    }
  }
})

store.watch(
  (state) => state.isDark,
  (isDark) => {
    vuetify.theme.global.name.value = isDark ? 'dark' : 'light';
  }
)

export default vuetify
