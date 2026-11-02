import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { router } from './router'
import { registerAppServiceWorker } from './pwa/register'
import './styles/tokens.css'
import './styles/app-shell.css'

registerAppServiceWorker()
createApp(App).use(createPinia()).use(router).mount('#app')
