<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { pb } from '@/backend'

const config = reactive({
  autoplay: 0,
  wrapAround: false,
  pauseAutoplayOnHover: true,
})

const images = ref<{ id: string; url: string }[]>([]) // Tableau pour stocker les images avec leur ID

const loadProjectImages = async () => {
  try {
    const projects = await pb.collection('projets').getFullList()

    images.value = projects
      .map((project) => {
        const image = project.imageProjet?.[0]
        return image
          ? { id: project.id, url: pb.getFileUrl(project, image) } // Stocke l'ID et l'URL
          : null
      })
      .filter((item): item is { id: string; url: string } => item !== null)

 
  } catch (error) {
    console.error('Erreur lors du chargement des images de projets:', error)
  }
}

// Charge les images
loadProjectImages()

onMounted(() => {
  setTimeout(() => {
    config.wrapAround = true
    config.autoplay = 2200
  }, 0.1) // Change wrapAround to true and autoplay to 2200 after 5 seconds
})

</script>

<template>
  <div class="carousel-container">
    <Carousel class="max-h-fit items-center flex" v-bind="config">
      <Slide v-for="image in images" :key="image.id">
        <div class="carousel__item h-full w-fit px-1">
          <img :src="image.url" :alt="'Slide ' + image.id" class="w-full h-full object-cover" />
        </div>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>
