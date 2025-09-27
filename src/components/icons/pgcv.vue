<template>
  <div class="pdf-viewer-container">
    <!-- Solution alternative avec iframe -->
    <iframe 
      :src="pdfUrl"
      class="pdf-viewer"
      frameborder="0">
    </iframe>
  </div>
</template>

<script>
export default {
  name: 'PgCV',
  computed: {
    pdfUrl() {
      return new URL('@/assets/cv-pierre-gachod.pdf', import.meta.url).href;
    }
  }
}
</script>

<style scoped>
.pdf-viewer-container {
  width: 100%;
  height: 100vh;
}

.pdf-viewer {
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
