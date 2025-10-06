<script setup lang="ts">
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { pb } from '@/backend'

const route = useRoute()
const currentSlide = ref(0)
const images = ref<{ id: number; url: string | undefined }[]>([])
// Replace 'ProjetsResponse' with the actual type if available, or use 'any' for a quick fix
const project = ref<any>(null)

const slideTo = (nextSlide: number) => (currentSlide.value = nextSlide)

const getImageUrl = (projectData: any, imageIndex: number = 0): string | undefined => {
  if (projectData?.imageProjet?.[imageIndex]) {
    return pb.getFileUrl(projectData, projectData.imageProjet[imageIndex])
  }
  return undefined
}

const loadProjectImages = async () => {
  try {
    const projectId = (route.params as { id?: string }).id
    if (!projectId) {
      throw new Error('Project ID is missing in route params')
    }
    const projectData = await pb.collection('projets').getOne(projectId)
    project.value = projectData

    if (projectData?.imageProjet?.length) {
      images.value = projectData.imageProjet
        .map((_, index) => ({
          id: index,
          url: getImageUrl(projectData, index)
        }))
        .filter((image) => image.url)
    }
  } catch (error) {
    console.error('Erreur lors du chargement du projet:', error)
  }
}

onMounted(() => {
  loadProjectImages()
})

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
    <Carousel id="gallery" v-bind="galleryConfig" v-model="currentSlide">
      <Slide v-for="image in images" :key="image.id">
        <img
          :src="image.url"
          :alt="`${project?.nomProjet || 'Project'} - Gallery Image`"
          class="gallery-image"
        />
      </Slide>
    </Carousel>

    <Carousel
      v-if="images.length > 1"
      id="thumbnails"
      v-bind="thumbnailsConfig"
      v-model="currentSlide"
    >
      <Slide v-for="(image, index) in images" :key="image.id">
        <template #default="{ isActive }">
          <div :class="['thumbnail', { 'is-active': isActive }]" @click="slideTo(index)">
            <img :src="image.url" alt="Thumbnail Image" class="thumbnail-image" />
          </div>
        </template>
      </Slide>

      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

<style>


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

.gallery-image {
  border-radius: 16px;
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
