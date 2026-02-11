<template>
  <div v-html="randomShape" class="shape-container"></div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

console.log('GeometricShapes component created')

const shapes = [
  '⭐', // Étoile classique
  '🌟', // Étoile brillante
  '✨', // Éclats de lumière
  '💫', // Tourbillon étoilé
  '🌕', // pleine lune
  '🪐', // Planète avec anneaux (style spatial)
  '🌑', // nouvelle lune
  '🚀', // fusée
  '🌙', // croissant lune
  '🛰️', // sartellite
  '🌍', // planète
  '🔭' // téléscope
]

interface Props {
  seed?: number | string
}

const props = withDefaults(defineProps<Props>(), {
  seed: 0
})

// Utiliser le seed pour générer un index stable
const randomIndex = computed(() => {
  const seedNum = typeof props.seed === 'string' ? props.seed.charCodeAt(0) : props.seed
  return seedNum % shapes.length
})

const randomShape = computed(() => `<span class="emoji">${shapes[randomIndex.value]}</span>`)
</script>

<style>
.shape-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.emoji {
  font-size: 60px; /* Taille des émojis */
}
</style>
