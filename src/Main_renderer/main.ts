import { createApp } from 'vue'
import '@wsfe/vue-tree/dist/style.css'
import './style.css'
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import { messages } from './i18n'
import { createPinia } from 'pinia'
import { setTheme } from './theme/theme'
import  router  from './router/router'

let config = window.electronAPI.configurate();
setTheme(config.theme);
const locale = config.language;

const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages
})

let app = createApp(App);
app.use(i18n).use(router).use(createPinia())
app.mount('#app');



