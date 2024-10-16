<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router/auto'
import LogInOut from './components/LogInOut.vue'
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
