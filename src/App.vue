<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router/auto'
import LogInOut from './components/LogInOut.vue'
import { onMounted } from 'vue'
import { initCustomCursor } from './assets/custom-cursor'
import LoadingSpinner from './components/LoadingSpinner.vue'
import { defineAsyncComponent } from 'vue'
import RouterReadyDummy from './components/RouterReadyDummy.vue'

// Composants asynchrones
const HeaderPage = defineAsyncComponent(() => import('@/components/HeaderPage.vue'))

// Cursor personnalisé
onMounted(() => {
  console.log('Vue app mounted')
  initCustomCursor()
})
</script>

<template>
  <Suspense>
    <template #default>
      <div id="app">
        <HeaderPage />
        <main>
          <!-- RouterView pour le contenu de la route -->
          <RouterView v-slot="{ Component }">
            <RouterReadyDummy />
            <component :is="Component" :key="$route.path" />
          </RouterView>
        </main>
      </div>
    </template>
    <template #fallback>
      <!-- Une seule page de chargement globale -->
      <LoadingSpinner />
    </template>
  </Suspense>
</template>
