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

function slugify(str: string) {
  return String(str)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const loadProjectImages = async () => {
  try {
    const params = route.params as { id?: string; slug?: string }
    const idParam = params.id
    const slugParam = params.slug

    let projectData: any = null

    if (idParam) {
      // ancien comportement : id direct
      projectData = await pb.collection('projets').getOne(idParam)
    } else if (slugParam) {
      // 1) si vous avez un champ `slug` côté PocketBase, essayer une requête filtrée
      try {
        const res = await pb.collection('projets').getList(1, 1, {
          filter: `slug = "${slugParam}"`
        })
        if (res.items && res.items.length) projectData = res.items[0]
      } catch (e) {
        // ignore si le filtre n'est pas supporté / champ absent
      }

      // 2) fallback : récupérer tout et comparer avec slugify(nomProjet) ou p.slug
      if (!projectData) {
        const all = await pb.collection('projets').getFullList()
        projectData = all.find((p: any) => (p.slug ?? slugify(p.nomProjet)) === slugParam)
      }
    } else {
      throw new Error('Project id/slug missing in route params')
    }

    if (!projectData) throw new Error('Project not found')

    project.value = projectData

    if (projectData?.imageProjet?.length) {
      images.value = projectData.imageProjet
        .map((_: any, index: number) => ({
          id: index,
          url: getImageUrl(projectData, index)
        }))
        .filter((image) => image.url)
    } else {
      images.value = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement du projet:', error)
    images.value = []
  }
}
// ...existing code...
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
          class="w-auto max-h-[90vh]"
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
            <img :src="image.url" alt="Thumbnail Image" class="w-full h-[10vh]" />
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
