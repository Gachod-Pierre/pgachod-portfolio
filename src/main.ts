import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'
import V3ScrollLock from 'v3-scroll-lock'
import Vue3Marquee from 'vue3-marquee'

const app = createApp(App)

app.use(
  createRouter({
    history: createWebHistory(),
    // pass the generated routes written by the plugin 🤖
    routes: routes,
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else if (to.hash) {
        // Assure-toi que l'élément existe avant d'effectuer le scroll
        if (document.querySelector(to.hash)) {
          return { el: to.hash, behavior: 'smooth' }
        }
        // Attends que la page se charge si l'élément n'est pas encore présent
        return new Promise((resolve) => {
          console.log("scrollBehavior to.hash", to.hash);
          setTimeout(() => {
            resolve({ el: to.hash, behavior: 'smooth' })
          }, 300)
        })
      } else {
        return { left: 0, top: 0 }
      }
    }
  })
)

app.use(V3ScrollLock, {})
app.use(Vue3Marquee)

app.mount('#app')
