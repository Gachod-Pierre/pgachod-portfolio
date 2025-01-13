<script setup lang="ts">
import { useRouter } from 'vue-router'

// On attend que le routeur soit prêt ET on ajoute un délai artificiel
const router = useRouter()

await new Promise<void>((resolve) => {
  router.isReady().then(() => {
    // Ajoute un délai de 2 secondes après que le routeur soit prêt
    setTimeout(() => {
      resolve()
    }, 2000) // Délai de 2 secondes
  })
})
</script>

<template>
  <!-- Ce composant ne rend rien -->
</template>
