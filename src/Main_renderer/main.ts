import { createApp } from 'vue'
import './style.css'
import 'md-editor-v3/lib/style.css';
import 'katex/dist/katex.min.css'
import 'cropperjs/dist/cropper.min.css'
import "@vavt/v3-extension/lib/asset/Emoji.css"
import "@vavt/v3-extension/lib/asset/PreviewThemeSwitch.css"
import "@vavt/v3-extension/lib/asset/ThemeSwitch.css"
import App from './App.vue'
import { createI18n } from 'vue-i18n'
import { messages } from './i18n'
import { createPinia } from 'pinia'
import { setTheme } from './theme/theme'
import  router  from './router/router'

let config = window.electronAPI.configurate();
setTheme(config.theme);
const locale = config.language;
console.log(locale);
const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages
})

let app = createApp(App);
app.use(i18n).use(router as any).use(createPinia())
app.mount('#app');



