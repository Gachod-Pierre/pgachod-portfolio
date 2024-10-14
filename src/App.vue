<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router/auto'
import LogInOut from './components/LogInOut.vue';
import LogInOutGoogle from './components/LogInOutGoogle.vue';
</script>

<template>
  <h1 class="text-2xl font-bold">template principale (Menu/footer...)</h1>
  <LogInOut/>
  <LogInOutGoogle/>
  <nav>
    <ul>
      <RouterLink to="/">Home</RouterLink>
    </ul>
  </nav>
  <main>
    <RouterView/>
  </main>
</template>

