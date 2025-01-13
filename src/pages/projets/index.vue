<template>
 
  <AsyncCarousel1/>
</template>

<script setup>
import AsyncCarousel1 from '@/components/AsyncCarousel1.vue';

/* Pas besoin de logique dynamique ici */
</script>

<style scoped>
/* Container principal pour le snapping */
.scroll-container {
  scroll-snap-type: y mandatory; /* Active le snapping vertical obligatoire */
  overflow-y: scroll; /* Active le défilement vertical */
  height: 100vh; /* Hauteur de la fenêtre visible */
  margin: 0;
  padding: 0;
}

/* Chaque section */
.section {
  scroll-snap-align: start; /* Verrouille chaque section au début */
  height: 100vh; /* Chaque section occupe la hauteur complète de la fenêtre */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  color: white;
  font-family: Arial, sans-serif;
}
</style>
