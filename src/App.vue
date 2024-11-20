<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router/auto'
import LogInOut from './components/LogInOut.vue'

import {  onMounted } from 'vue'
import { initCustomCursor } from './assets/custom-cursor'

import HeaderPage from './components/HeaderPage.vue'

onMounted(() => {
  console.log('Vue app mounted')
  initCustomCursor()
})

</script>

<template>
  <HeaderPage />
  <main>
    <RouterView v-slot="{ Component }">
      <Suspense>
        <component :is="Component" :key="$route.path" />
      </Suspense>
    </RouterView>
  </main>
</template>
