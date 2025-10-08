<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { pb } from '@/backend'
import ImgPb from '@/components/ImgPb.vue'

const route = useRoute()
const router = useRouter()

const project = ref<any>(null)
const loading = ref(true)
const error = ref('')

const AsyncCarousel3 = defineAsyncComponent(() => import('@/components/AsyncCarousel3.vue'))

const loadProject = async () => {
  try {
    loading.value = true
    const projectId = (route.params as { id?: string })?.id ?? ''

    const projectData = await pb.collection('projets').getOne(projectId)
    project.value = projectData
  } catch (err) {
    console.error('Erreur lors du chargement du projet:', err)
    error.value = 'Projet non trouvé'
  } finally {
    loading.value = false
  }
}

const getImageUrl = (project: any, imageIndex: number = 0): string | undefined => {
  if (project?.imageProjet?.[imageIndex]) {
    return pb.getFileUrl(project, project.imageProjet[imageIndex])
  }
  return undefined
}

const goBack = () => {
  router.back()
}

onMounted(() => {
  loadProject()
})
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <!-- Header avec bouton retour -->
    <div class="md:container mx-0 py-14">
      <button
        @click="goBack"
        class="flex items-center gap-2 text-white hover:text-purple-500 transition-colors duration-300 border border-white hover:border-purple-500 p-3 rounded-2xl"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.42-1.41L7.83 13H20v-2z" />
        </svg>
        Retour
      </button>
    </div>

    <!-- Contenu principal -->
    <div class="md:container mx-0">
      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center min-h-96">
        <div class="text-2xl">Chargement...</div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="flex justify-center items-center min-h-96">
        <div class="text-2xl text-red-500">{{ error }}</div>
      </div>

      <!-- Project Details -->
      <div v-else-if="project" class="space-y-20 pb-20">
        <!-- Section principale avec titre/infos à gauche et image à droite -->
        <div class="flex flex-col layout-responsive gap-10 md:gap-20">
          <!-- Informations du projet à gauche -->
          <div class="flex md:flex-col flex-row md:justify-normal justify-between">
            <h1 class="titleProject2">{{ project.nomProjet }}</h1>
            <div>
              <p v-if="project.typeProjet" class="text-xl lg:text-2xl text-grey-300 mt-0 md:mt-4">
                {{ project.typeProjet }}
              </p>
              <p v-if="project.dateProjet" class="text-lg text-purple-600 mt-2">
                {{ new Date(project.dateProjet).toLocaleDateString('fr-FR') }}
              </p>
            </div>
          </div>

          <!-- Image du projet à droite -->
          <div v-if="getImageUrl(project)" class="flex-1">
            <img
              :src="getImageUrl(project)"
              :alt="project.nomProjet"
              class="w-full h-auto rounded-lg shadow-2xl"
            />
          </div>
        </div>

        <!-- Nouvelle section : Outils/Techno à gauche et Détails à droite -->
        <div class="flex flex-col layout-responsive gap-8">
          <!-- Outils/Techno à gauche -->
          <div class="flex-1 w-[100%] lg:w[50%]">
            <div
              class="border border-gray-600 rounded-lg flex flex-col justify-between p-11 grid-background aspect-square md:aspect-auto"
            >
              <div class="flex flex-col gap-10">
                <div class="flex flex-col gap-4">
                  <h3 class="titleProject mb-4">Outils / Techno</h3>
                  <div
                    v-if="project.outils && project.outils.length > 0"
                    class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4"
                  >
                    <div
                      v-for="(outil, index) in project.outils"
                      :key="index"
                      class="flex justify-center"
                    >
                      <ImgPb
                        :record="project"
                        :filename="outil"
                        :alt="`Outil ${index + 1}`"
                        class="w-12 h-12 object-contain"
                      />
                    </div>
                  </div>
                  <p v-else class="text-gray-400 italic">Aucun outil spécifié</p>
                </div>
                <div>
                  <h3 class="titleProject mb-4">Statut</h3>
                  <p
                    v-if="project.statut !== undefined"
                    class="text-lg mt-2 flex items-center gap-2"
                  >
                    <!-- SVG pour "En cours" - spinner animé -->
                    <svg
                      v-if="!project.statut"
                      class="animate-spin w-5 h-5 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      />
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>

                    <!-- SVG pour "Terminé" - checkmark animé -->
                    <svg
                      v-else
                      class="w-5 h-5 text-green-500 checkmark-animation"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                        class="checkmark-path"
                      />
                    </svg>

                    <span :class="project.statut ? 'text-green-500' : 'text-orange-500'">
                      {{ project.statut ? 'Terminé' : 'En cours' }}
                    </span>
                  </p>
                </div>
                <div v-if="project.lienProjet">
                  <h3 class="titleProject mb-4">Lien Projet</h3>
                  <a
                    :href="project.lienProjet"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors duration-300"
                  >
                    Voir le projet
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Détails du projet à droite -->
          <div class="flex-1 flex flex-col gap-10 max-w-[100%] layout-responsive:max-w-[50%]">
            <!-- Description -->
            <div class="flex flex-col">
              <p class="text-gray-300 text-justify">{{ project.descriptionProjet }}</p>
            </div>

            <!-- Detail 1 -->
            <div v-if="project.detail1 && project.detailContent1" class="flex flex-col">
              <div class="flex flex-col">
                <div class="flex flex-col mb-4">
                  <h4 class="titleProject2 mb-4">{{ project.detail1 }}</h4>
                  <div class="flex flex-col">
                    <p class="text-gray-300 text-justify">{{ project.detailContent1 }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Detail 2 -->
            <div v-if="project.detail2 && project.detailContent2" class="flex flex-col">
              <div class="flex flex-col">
                <div class="flex flex-col">
                  <h4 class="titleProject2 mb-2">{{ project.detail2 }}</h4>
                  <div class="flex flex-col">
                    <p class="text-gray-300 text-justify">{{ project.detailContent2 }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AsyncCarousel3 />
      </div>
    </div>
  </div>
</template>

<style scoped>
.checkmark-animation {
  animation: checkmark-appear 0.6s ease-in-out;
}

.checkmark-path {
  stroke-dasharray: 20;
  stroke-dashoffset: 20;
  animation: checkmark-draw 3s ease-in-out infinite;
}

@keyframes checkmark-appear {
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes checkmark-draw {
  0% {
    stroke-dashoffset: 20;
  }
  25% {
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dashoffset: -20;
  }
  50%,
  100% {
    stroke-dashoffset: 20;
  }
}

/* Ajout : forcer la direction en row à partir de 1225px */
@media (min-width: 1225px) {
  .layout-responsive {
    flex-direction: row;
  }
}
</style>
