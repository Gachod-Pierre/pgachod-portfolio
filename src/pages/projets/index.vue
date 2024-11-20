<template>
  <div class="scroll-container">
    <!-- Section 1 -->
    <div class="section" style="background-color: #1abc9c">
      <h1>Section 1</h1>
    </div>
    <!-- Section 2 -->
    <div class="section" style="background-color: #3498db">
      <h1>Section 2</h1>
    </div>
    <!-- Section 3 -->
    <div class="section" style="background-color: #9b59b6">
      <h1>Section 3</h1>
    </div>
    <!-- Section 4 -->
    <div class="section" style="background-color: #e74c3c">
      <h1>Section 4</h1>
    </div>
  </div>
</template>

<script setup>
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
