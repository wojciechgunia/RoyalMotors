import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { plugin as FormKitPlugin, defaultConfig } from '@formkit/vue'
import Tres from '@tresjs/core'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import config from './formkit.config.ts'
import ToastPlugin from 'vue-toast-notification'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(Tres)
app.use(FormKitPlugin, defaultConfig(config))
app.use(ToastPlugin)
app.mount('#app')
