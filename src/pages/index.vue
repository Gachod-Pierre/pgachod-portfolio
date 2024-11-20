<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, type Component } from 'vue'
import { pb } from '@/backend'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { useIntersectionObserver } from '@vueuse/core'
import IconHtml from '@/components/icons/iconHtml.vue'
import IconCss from '@/components/icons/iconCss.vue'
import IconJs from '@/components/icons/iconJs.vue'
import IconAi from '@/components/icons/iconAi.vue'
import IconAe from '@/components/icons/iconAe.vue'
import IconDavinci from '@/components/icons/iconDavinci.vue'
import IconFigma from '@/components/icons/iconFigma.vue'
import IconPhotoshop from '@/components/icons/iconPhotoshop.vue'
import IconPython from '@/components/icons/iconPython.vue'
import IconVue from '@/components/icons/iconVue.vue'

interface Skill {
  id: number
  name: string
  icon: Component // URL ou classe CSS pour l'icône
  x: number
  y: number
  visible: boolean
  initialX?: number
  initialY?: number
}

const config = {
  autoplay: 2200,
  wrapAround: true,
  pauseAutoplayOnHover: true
}

const skills = reactive<Skill[]>([
  {
    id: 1,
    name: 'HTML',
    icon: IconHtml,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 2,
    name: 'CSS',
    icon: IconCss,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 3,
    name: 'JavaScript',
    icon: IconJs,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 4,
    name: 'AI',
    icon: IconAi,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 5,
    name: 'AE',
    icon: IconAe,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 6,
    name: 'Davinci Resolve',
    icon: IconDavinci,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 7,
    name: 'Figma',
    icon: IconFigma,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 8,
    name: 'Photoshop',
    icon: IconPhotoshop,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 9,
    name: 'Python',
    icon: IconPython,
    x: 0,
    y: 0,
    visible: false
  },
  {
    id: 10,
    name: 'Vue.js',
    icon: IconVue,
    x: 0,
    y: 0,
    visible: false
  }
])

const sectionVisible = ref(false)
const isDragging = ref(false)
const activeSkillId = ref<number | null>(null)
const sectionRef = ref<HTMLElement | null>(null)

// Fonction pour générer des positions aléatoires sans chevauchement
const generateRandomPositions = (width: number, height: number, size: number) => {
  const positions: { x: number; y: number }[] = []
  const margin = size * 1.5 // Marge pour éviter débordements

  skills.forEach((skill) => {
    let x, y
    let overlapping

    do {
      // Générer des coordonnées x et y aléatoires
      x = Math.random() * (width - margin - size) + margin / 2
      y = Math.random() * (height - margin - size) + margin / 2

      // Vérifier le chevauchement avec les positions existantes
      overlapping = positions.some((pos) => {
        const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2)
        return distance < size // Empêche les chevauchements
      })
    } while (overlapping) // Répéter jusqu'à ce qu'une position sans chevauchement soit trouvée

    // Ajouter la position au tableau et assigner à la compétence
    positions.push({ x, y })
    skill.x = x
    skill.y = y
  })
}

// Fonction de drag & drop
const startDrag = (skillId: number, event: MouseEvent) => {
  isDragging.value = true
  activeSkillId.value = skillId
  event.preventDefault()
}

const onDrag = (event: MouseEvent) => {
  if (!isDragging.value || activeSkillId.value === null) return
  const skill = skills.find((s) => s.id === activeSkillId.value)
  if (skill) {
    skill.x += event.movementX
    skill.y += event.movementY
  }
}

const stopDrag = () => {
  isDragging.value = false
  activeSkillId.value = null
}

// Observer pour détecter quand la section entre dans le viewport
useIntersectionObserver(
  sectionRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      sectionVisible.value = true
      skills.forEach((skill) => (skill.visible = true))
    }
  },
  { threshold: 0.5 }
)

const images = ref<string[]>([])

async function loadProjectImages() {
  try {
    const projects = await pb.collection('projets').getFullList()
    images.value = projects
      .map((project) => {
        const image = project.imageProjet?.[0]
        return image ? pb.getFileUrl(project, image) : null
      })
      .filter((imageUrl): imageUrl is string => imageUrl !== null)
  } catch (error) {
    console.error('Erreur lors du chargement des images de projets:', error)
  }
}

// Initialisation des positions aléatoires et des événements globaux
onMounted(() => {
  loadProjectImages()

  const sectionElement = sectionRef.value
  if (sectionElement) {
    const { offsetWidth: sectionWidth, offsetHeight: sectionHeight } = sectionElement
    const iconSize = 128 // Taille des icônes en pixels
    generateRandomPositions(sectionWidth, sectionHeight, iconSize)
  }

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
})
</script>

<template>
  <div class="snap-container">
    <!-- Section 1 : Carrousel -->
    <section
      class="snap-start flex flex-col justify-start items-center w-full h-screen bg-black text-white gap-20"
    >
      <div
        class="flex max-w-full max-h-[70%] justify-start items-center self-stretch relative gap-[76px] overflow-hidden"
      >
        <div class="flex flex-col justify-start items-start flex-grow relative gap-[88px]">
          <p class="self-stretch text-left">
            <span class="self-stretch title2">Pierre</span><br />
            <span class="self-stretch title1">Gachod</span>
          </p>
          <div class="flex justify-start items-center self-stretch relative gap-[15px]">
            <svg
              width="25"
              height="16"
              viewBox="0 0 25 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="mb-2 oscillate w-[23.57px] h-3.5"
              preserveAspectRatio="none"
            >
              <path d="M1 6L12.6913 15L24.3827 6" stroke="white"></path>
              <path d="M1.19135 1L12.8827 10L24.574 1" stroke="white"></path>
            </svg>
            <p class="text-xl font-bold">
              Scroll <span class="text-xl font-light">to</span> Discover
              <span class="text-xl font-light">me</span>
            </p>
          </div>
        </div>
        <Carousel class="max-h-fit items-center flex" v-bind="config">
          <Slide v-for="(image, index) in images" :key="index">
            <div class="carousel__item">
              <img :src="image" :alt="'Slide ' + (index + 1)" class="w-full h-full object-cover" />
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </div>
      <div class="w-full pb-11 border-b border-white flex justify-center items-center bg-black">
        <Vue3Marquee :pause-on-hover="true" :loop="0" class="w-full overflow-hidden">
          <p class="lg:text-9xl text-xl font-extrabold text-left text-white">
            WEB DEVELOPER
            <span class="lg:text-9xl text-xl font-thin text-left text-white"
              >SEARCH ENGINE OPTIMISING</span
            >
            DESIGNER
            <span class="lg:text-9xl text-xl font-light text-left text-white"
              >PROJECT MANAGEMENT</span
            >
          </p>
        </Vue3Marquee>
      </div>
    </section>

    <!-- Section Skills -->
    <section
      ref="sectionRef"
      class="z-50 snap-start flex flex-col justify-center items-center bg-white relative w-full h-screen"
    >
      <h2 class="text-3xl font-bold text-center my-6">Skills</h2>
      <div class="relative w-full h-full">
        <div v-for="skill in skills" :key="skill.id">
          <div
            :style="{
              transform: skill.visible
                ? `translate(${skill.x}px, ${skill.y}px)`
                : `translate(${skill.initialX}px, ${skill.initialY}px)`,
              opacity: skill.visible ? 1 : 0,
              transition: skill.visible
                ? 'transform 0.8s cubic-bezier(0.25, 0.25, 0.25, 1), opacity 0.8s ease'
                : 'none'
            }"
            class="absolute cursor-grab"
            @mousedown="startDrag(skill.id, $event)"
          >
            <component :is="skill.icon" class="w-32 h-32" :title="skill.name" />
          </div>
        </div>
      </div>
    </section>
    <!-- Section 3 -->
    <section
      class="snap-start flex flex-col justify-center items-center w-full h-screen bg-gray-700 text-white"
    >
      <h2 class="text-4xl lg:text-6xl font-bold">Section Supplémentaire</h2>
      <p class="text-xl lg:text-2xl mt-4 max-w-3xl text-center">
        Une section supplémentaire pour illustrer le comportement de snapping.
      </p>
    </section>
  </div>
</template>

<style scoped>
.snap-container {
  scroll-snap-type: y mandatory;
  overflow-y: scroll;
  height: 100vh;
}

section {
  scroll-snap-align: start;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding-top: 30px;
  padding-bottom: 30px;
}

.icon {
  width: 50px;
  height: 50px;
}
</style>
