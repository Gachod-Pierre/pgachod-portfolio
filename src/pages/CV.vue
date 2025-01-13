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