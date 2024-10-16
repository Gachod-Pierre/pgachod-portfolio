<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router/auto'
import LogInOut from './components/LogInOut.vue'

import {  onMounted } from 'vue'
import { initCustomCursor } from './assets/custom-cursor'

onMounted(() => {
  console.log('Vue app mounted')
  initCustomCursor()
})

</script>

<template>
  <LogInOut />
  <nav>
    <ul>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/projets">projets</RouterLink>
    </ul>
  </nav>
  <main>
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" :key="$route.path" />
      </Suspense>
    </RouterView>
  </main>
</template>
