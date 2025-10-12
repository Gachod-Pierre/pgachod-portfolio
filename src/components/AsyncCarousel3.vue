<!-- src/components/AsyncCarousel3.vue -->
<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { ref } from 'vue'

const props = defineProps<{
  images: { id: number; url: string | undefined }[]
  projectName?: string
}>()

const currentSlide = ref(0)
const slideTo = (nextSlide: number) => (currentSlide.value = nextSlide)

const galleryConfig = {
  itemsToShow: 1,
  wrapAround: true,
  slideEffect: 'fade',
  mouseDrag: false,
  touchDrag: false,
  height: 320
}

const thumbnailsConfig = {
  height: 80,
  itemsToShow: 6,
  wrapAround: true,
  touchDrag: false,
  gap: 10
}
</script>

<template>
  <div v-if="images.length > 0">
    <!-- Galerie principale -->
    <Carousel id="gallery" v-bind="galleryConfig" v-model="currentSlide">
      <Slide v-for="image in images" :key="image.id">
        <img
          :src="image.url"
          :alt="`${projectName || 'Project'} - Gallery Image`"
          class="w-auto max-h-[90vh]"
        />
      </Slide>
    </Carousel>

    <!-- Miniatures -->
    <Carousel
      v-if="images.length > 1"
      id="thumbnails"
      v-bind="thumbnailsConfig"
      v-model="currentSlide"
    >
      <Slide v-for="(image, index) in images" :key="image.id">
        <template #default="{ isActive }">
          <div :class="['thumbnail', { 'is-active': isActive }]" @click="slideTo(index)">
            <img :src="image.url" alt="Thumbnail Image" class="w-full h-[10vh]" />
          </div>
        </template>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>

  <div v-else class="text-center text-gray-400 py-10">Aucune image à afficher</div>
</template>

<style scoped>
.carousel {
  --vc-nav-background: rgba(255, 255, 255, 0.7);
  --vc-nav-border-radius: 100%;
}

img {
  border-radius: 8px;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#thumbnails {
  margin-top: 10px;
}

.thumbnail {
  height: 100%;
  width: 100%;
  cursor: pointer;
  opacity: 0.6;
  transition: opacity 0.3s ease-in-out;
}

.thumbnail.is-active,
.thumbnail:hover {
  opacity: 1;
}
</style>
