<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { RouterLink } from 'vue-router'
import ImgPb from '@/components/ImgPb.vue'
import GeometricShapes from '@/components/GeometricShapes.vue'
import { pb } from '@/backend'

function truncateText(text: string, wordLimit: number): string {
  if (!text) return ''
  const words = text.split(' ')
  if (words.length <= wordLimit) return text
  return words.slice(0, wordLimit).join(' ') + '...'
}

const config2 = reactive({
  autoplay: 2600,
  wrapAround: true,
  autoplayEnabled: false,
  pauseAutoplayOnHover: true
})

const projects = ref<any[]>([])

const loadProjects = async () => {
  try {
    projects.value = await pb.collection('projets').getFullList()
    config2.autoplayEnabled = true
  } catch (error) {
    console.error('Erreur lors du chargement des projets:', error)
  }
}

onMounted(() => {
  loadProjects()
})

</script>

<template>
  <div class="">
    <Carousel v-if="config2.autoplayEnabled" class="h-full w-full flex items-center justify-center" v-bind="config2">
      <Slide class="lg:px-20" v-for="project in projects" :key="project.id">
        <RouterLink class="w-full h-fit" :to="`/projects/${project.id}`">
          <div class="grid grid-cols-2 md:grid-cols-4 grid-rows-8 gap-3 md:gap-5 w-full h-fit px-1">
            <!-- Titre du projet -->
            <div class="flex items-center border border-white col-span-2 col-start-1 row-span-2 row-start-1 rounded-3xl">
              <p class="px-3 titleProject2">
                {{ project.nomProjet }} <span class="titleProject">project</span>
              </p>
            </div>
            <!-- Catégorie du projet -->
            <div
              class="flex items-center justify-center border border-white col-span-1 md:col-span-2 col-start-1 md:col-start-3 row-span-1 row-start-8 md:row-start-1 rounded-3xl"
            >
              <p>{{ project.typeProjet }}</p>
            </div>
            <!-- Image du projet -->
            <div
              class="overflow-hidden border border-white col-span-2 h-auto row-span-5 rounded-3xl col-start-1 md:row-start-3"
            >
              <ImgPb
                v-if="project.imageProjet"
                :record="project"
                :filename="project.imageProjet[0]"
              />
            </div>
            <!-- Date -->
            <div
              class="flex items-center justify-center border border-white col-span-1 md:col-span-2 col-start-2 row-span-1 rounded-3xl row-start-8"
            >
              <p>{{ project.dateProjet ? project.dateProjet.split(' ')[0] : '' }}</p>
            </div>
            <!-- Description du projet -->
            <div
              class="flex items-center text-start border border-white col-span-2 row-span-5 rounded-3xl col-start-1 md:col-start-3 row-start-9 md:row-start-2"
            >
              <p class="py-1 px-3 hidden md:flex">
                {{ truncateText(project.descriptionProjet, 70) }}
              </p>
              <p class="py-1 px-3 md:hidden sm:flex">
                {{ truncateText(project.descriptionProjet, 15) }}
              </p>
            </div>
            <!-- Illus du projet -->
            <div
              class="hidden md:flex items-center justify-center border border-white col-span-2 md:col-span-1 row-span-2 rounded-3xl col-start-1 md:col-start-3 row-start-17 md:row-start-7"
            >
              <GeometricShapes />
            </div>
            <!-- see more -->
            <div
              class="flex items-center bg-purple-700 hover:bg-purple-500 justify-center border border-white col-span-2 md:col-span-1 md:row-span-2 row-span-1 rounded-3xl row-start-14 md:row-start-7 col-start-1 md:col-start-4"
            >
              <RouterLink
                class="hover:scale-105 font-extrabold ease-in-out duration-100 w-full h-full flex items-center justify-center"
                :to="`/projects/${project.id}`"
              >
                &lt;/see project&gt;
              </RouterLink>
            </div>
          </div>
        </RouterLink>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </div>
</template>

