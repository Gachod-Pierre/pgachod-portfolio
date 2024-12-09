<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const AsyncPgcv = defineAsyncComponent(() => import('@/components/icons/pgcv.vue'))
</script>

<template>
  <Suspense>
    <template #default>
      <AsyncPgcv/>
    </template>
    <template #fallback>
      <div class="loading-container">
        <LoadingSpinner />
      </div>
    </template>
  </Suspense>
</template>

<style>
.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

@media (min-width: 1024px) {
  .loading-container {
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
  }
}

</style>