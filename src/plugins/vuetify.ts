/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'
import { VStepperVertical } from 'vuetify/labs/VStepperVertical'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

function getInitialTheme(): 'light' | 'dark' {
  try {
    const saved = localStorage.getItem('theme')
    return saved === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: getInitialTheme(),
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#1E88E5',
          secondary: '#EC407A',
        },
      },
      dark: {
        dark: true,
        colors: {
          primary: '#90CAF9',
          secondary: '#F48FB1',
        },
      },
    },
  },
  components: {
    VStepperVertical,
    VueDatePicker
  },
})
