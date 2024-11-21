import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import V3ScrollLock from 'v3-scroll-lock'
import Vue3Marquee from 'vue3-marquee'

const app = createApp(App)

app.use(createRouter({
  history: createWebHistory(),
  // pass the generated routes written by the plugin 🤖
  routes : routes
}))

app.use(V3ScrollLock, {})
app.use(Vue3Marquee)

app.mount('#app')
