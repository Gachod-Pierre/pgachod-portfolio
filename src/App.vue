<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router/auto';
import LogInOut from './components/LogInOut.vue';
import { onMounted } from 'vue';
import { initCustomCursor } from './assets/custom-cursor';
// import HeaderPage from './components/HeaderPage.vue';
import LoadingSpinner from './components/LoadingSpinner.vue';

import { defineAsyncComponent } from 'vue'

onMounted(() => {
  console.log('Vue app mounted');
  initCustomCursor();
});

const HeaderPage = defineAsyncComponent(() => import('@/components/HeaderPage.vue'))
</script>

<template>
  <HeaderPage />
  <Suspense>
    <template #default>
      <main>
        <RouterView v-slot="{ Component }">
          <component :is="Component" :key="$route.path" />
        </RouterView>
      </main>
    </template>
    <template #fallback>
      <LoadingSpinner />
    </template>
  </Suspense>
</template>