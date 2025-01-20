<script setup lang="ts">
import Logo from './icons/logo-site.vue'
</script>

<template>
  <div class="spinner-container">
    <div class="spinner">
      <div class="spinner-rotating"></div>
      <Logo class="spinner-logo" />
    </div>
  </div>
</template>

<style scoped>
.spinner-container {
  position: fixed; /* Position fixe pour couvrir toute la fenêtre */
  top: 0;
  left: 0;
  background-color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Utilisation de vh pour couvrir toute la hauteur de la fenêtre */
  width: 100vw; /* Utilisation de vw pour couvrir toute la largeur de la fenêtre */
  z-index: 1000;
}

.spinner {
  position: relative;
  width: 70px;
  height: 70px;
}

.spinner-rotating {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: #fff;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  animation: spin 1s linear infinite;
}

.spinner-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px; /* Adjust as needed */
  height: 30px; /* Adjust as needed */
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
