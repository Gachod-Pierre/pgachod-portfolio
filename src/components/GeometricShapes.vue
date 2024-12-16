<template>
  <div v-html="randomShape" class="shape-container"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

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

const randomIndex = Math.floor(Math.random() * shapes.length)
const randomShape = ref(`<span class="emoji">${shapes[randomIndex]}</span>`)

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
