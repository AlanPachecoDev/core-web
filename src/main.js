import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './assets/main.css'

//Iconos
import '@mdi/font/css/materialdesignicons.css'


//Vuetify
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';

//Element plus
import ElementPlus from 'element-plus'
import 'element-plus/theme-chalk/index.css' // Importa los estilos de Element Plus
import '@element-plus/icons-vue'

//vueSweetAlert2
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import { mdiAccount } from '@mdi/js'


const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App)
app.component('mdi-account', mdiAccount)
app.use(vuetify)
app.use(ElementPlus)
app.use(createPinia())
app.use(router)
app.use(VueSweetalert2);


app.mount('#app')
