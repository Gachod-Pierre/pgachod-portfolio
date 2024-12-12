<template>
  <div v-html="randomShape" class="shape-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const shapes = [

]

const randomShape = ref('')

onMounted(() => {
  const randomIndex = Math.floor(Math.random() * shapes.length)
  randomShape.value = shapes[randomIndex]
})
</script>

<style>
.shape-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
