import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import VScrollLock from 'v-scroll-lock'
import Vue3Marquee from 'vue3-marquee'

const app = createApp(App)

app.use(createRouter({
  history: createWebHistory(),
  // pass the generated routes written by the plugin 🤖
  routes : routes
}))

app.use(VScrollLock, {})
app.use(Vue3Marquee)

app.mount('#app')
