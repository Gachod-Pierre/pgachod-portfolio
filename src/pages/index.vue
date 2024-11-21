<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, type Component } from 'vue'
import { pb } from '@/backend'
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'
import { useIntersectionObserver } from '@vueuse/core'
import { markRaw } from 'vue'

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
import iconClic from '@/components/icons/iconClic.vue'

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
  { id: 1, name: 'HTML', icon: markRaw(IconHtml), x: 0, y: 0, visible: false },
  { id: 2, name: 'CSS', icon: markRaw(IconCss), x: 0, y: 0, visible: false },
  { id: 3, name: 'JavaScript', icon: markRaw(IconJs), x: 0, y: 0, visible: false },
  { id: 4, name: 'AI', icon: markRaw(IconAi), x: 0, y: 0, visible: false },
  { id: 5, name: 'AE', icon: markRaw(IconAe), x: 0, y: 0, visible: false },
  { id: 6, name: 'Davinci Resolve', icon: markRaw(IconDavinci), x: 0, y: 0, visible: false },
  { id: 7, name: 'Figma', icon: markRaw(IconFigma), x: 0, y: 0, visible: false },
  { id: 8, name: 'Photoshop', icon: markRaw(IconPhotoshop), x: 0, y: 0, visible: false },
  { id: 9, name: 'Python', icon: markRaw(IconPython), x: 0, y: 0, visible: false },
  { id: 10, name: 'Vue.js', icon: markRaw(IconVue), x: 0, y: 0, visible: false }
])

const sectionVisible = ref(false)
const isDragging = ref(false)
const activeSkillId = ref<number | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const lastTouchPosition = ref<{ x: number; y: number } | null>(null)

const generateRandomPositions = (width: number, height: number, size: number) => {
  const positions: { x: number; y: number }[] = []
  const margin = size * 1.5

  skills.forEach((skill) => {
    let x: number, y: number
    let overlapping

    do {
      x = Math.random() * (width - size)
      y = Math.random() * (height - size - elementHeight.value - 30)

      overlapping = positions.some((pos) => {
        const distance = Math.sqrt((pos.x - x) ** 2 + (pos.y - y) ** 2)
        return distance < size
      })
    } while (overlapping)

    positions.push({ x, y })
    skill.x = x
    skill.y = y
  })
}

const startDrag = (skillId: number, event: MouseEvent | TouchEvent) => {
  isDragging.value = true
  activeSkillId.value = skillId
  document.body.classList.add('no-select') // Bloque la sélection de texte globalement

  if (event instanceof TouchEvent) {
    const touch = event.touches[0]
    lastTouchPosition.value = { x: touch.clientX, y: touch.clientY }
    event.preventDefault()
  } else if (event instanceof MouseEvent) {
    event.preventDefault()
  }
}

const onDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || activeSkillId.value === null) return

  const sectionElement = sectionRef.value
  if (!sectionElement) return

  const { offsetWidth: sectionWidth, offsetHeight: sectionHeight } = sectionElement
  const iconSize = window.innerWidth >= 1024 ? 128 : 80

  const skill = skills.find((s) => s.id === activeSkillId.value)
  if (skill) {
    let movementX = 0
    let movementY = 0

    if (event instanceof MouseEvent) {
      movementX = event.movementX
      movementY = event.movementY
    } else if (event instanceof TouchEvent) {
      const touch = event.touches[0]
      if (lastTouchPosition.value) {
        movementX = touch.clientX - lastTouchPosition.value.x
        movementY = touch.clientY - lastTouchPosition.value.y
      }
      lastTouchPosition.value = { x: touch.clientX, y: touch.clientY }
    }

    skill.x += movementX
    skill.y += movementY

    constrainPosition(skill, sectionWidth, sectionHeight, iconSize)
  }

  event.preventDefault() // Bloque le comportement par défaut
}

const stopDrag = () => {
  isDragging.value = false
  activeSkillId.value = null
  lastTouchPosition.value = null
  document.body.classList.remove('no-select') // Réactive la sélection de texte
}

const constrainPosition = (
  skill: Skill,
  sectionWidth: number,
  sectionHeight: number,
  iconSize: number
) => {
  if (skill.x < 0) skill.x = 0
  else if (skill.x > sectionWidth - iconSize) skill.x = sectionWidth - iconSize

  if (skill.y < 0) skill.y = 0
  else if (skill.y > sectionHeight - (iconSize + elementHeight.value + 30))
    skill.y = sectionHeight - (iconSize + elementHeight.value + 30)
}

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

const elementHeight = ref(0)

onMounted(() => {
  const element = document.querySelector('.title1.my-6')
  if (element) {
    const rect = element.getBoundingClientRect()
    const style = window.getComputedStyle(element)
    const marginTop = parseFloat(style.marginTop)
    const marginBottom = parseFloat(style.marginBottom)
    const paddingTop = parseFloat(style.paddingTop)
    const paddingBottom = parseFloat(style.paddingBottom)

    elementHeight.value = rect.height + marginTop + marginBottom + paddingTop + paddingBottom + 30
  }

  loadProjectImages()

  const sectionElement = sectionRef.value
  if (sectionElement) {
    const { offsetWidth: sectionWidth, offsetHeight: sectionHeight } = sectionElement
    const iconSize = window.innerWidth >= 1024 ? 128 : 80
    generateRandomPositions(sectionWidth, sectionHeight, iconSize)
  }

  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag, { passive: false })
  window.addEventListener('touchend', stopDrag)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
})
</script>

<template>
  <div class="snap-container">
    <!-- Définir le filtre SVG pour la lueur -->
    <svg width="0" height="0">
      <filter id="glow">
        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
        <feMerge>
          <feMergeNode in="coloredBlur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </svg>

    <!-- Section 1 : Carrousel -->
    <section
      class="snap-start flex flex-col justify-between items-center w-full bg-black text-white"
    >
      <div
        class="flex flex-col justify-between md:flex-row max-w-full max-h-full lg:justify-start lg:items-center self-stretch relative md:gap-[76px] overflow-hidden"
      >
        <div
          class="flex flex-col justify-start items-start flex-grow relative gap-10 lg:gap-[88px]"
        >
          <h1 class="self-stretch text-left">
            <span class="self-stretch title2">Pierre</span><br />
            <span class="self-stretch title1">Gachod</span>
          </h1>
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
            <div class="carousel__item h-full w-full">
              <img :src="image" :alt="'Slide ' + (index + 1)" class="w-full h-full object-cover" />
            </div>
          </Slide>
          <template #addons>
            <Navigation />
          </template>
        </Carousel>
      </div>
      <div class="w-full pb-11 border-b border-white flex justify-center items-center bg-black">
        <Vue3Marquee :pause-on-hover="true" :loop="0" class="w-full h-fit overflow-hidden">
          <p class="lg:text-9xl text-xl font-extrabold text-left text-white h-fit">
            WEB DEVELOPER
            <span class="h-fit lg:text-9xl text-xl font-thin text-left text-white"
              >SEARCH ENGINE OPTIMISING</span
            >
            DESIGNER
            <span class="h-fit lg:text-9xl text-xl font-light text-left text-white"
              >PROJECT MANAGEMENT</span
            >
          </p>
        </Vue3Marquee>
      </div>
    </section>

    <!-- Section Skills -->
    <section
      ref="sectionRef"
      class="snap-start flex flex-col bg-black relative w-full h-screen"
    >
      <div class="flex justify-between items-center">
        <h2 class="title1 my-6 border-b border-white w-fit">Skills</h2>
        <iconClic/>
      </div>
      <div class="relative w-full h-full grid-background">
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
            @touchstart="startDrag(skill.id, $event)"
          >
            <div
              :class="{
                'icon-glow': skill.visible,
                shake: isDragging && activeSkillId === skill.id
              }"
            >
              <component :is="skill.icon" class="w-20 h-20 lg:w-32 lg:h-32" :title="skill.name" />
            </div>
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

@media (max-width: 768px) {
  /* Ajustez cette valeur selon vos besoins */
  section {
    scroll-snap-align: start;
    height: calc(100vh - 96px);
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    padding-bottom: 30px;
  }

  .snap-container {
    scroll-snap-type: y mandatory;
    overflow-y: scroll;
    height: calc(100vh - 96px);
  }
}

.icon {
  width: 50px;
  height: 50px;
}

body.no-select {
  user-select: none; /* Désactive la sélection de texte */
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

@keyframes breathe {
  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.1));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
  }
}

@keyframes shake {
  0%,
  100% {
    transform: rotate(0deg);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: rotate(-2deg);
  }
  20%,
  40%,
  60%,
  80% {
    transform: rotate(2deg);
  }
}

.icon-glow {
  animation: breathe 2s infinite;
}

.shake {
  animation: shake 1s infinite;
}

.grid-background {
  background-image: linear-gradient(rgba(255, 255, 255, 0.1) 0.5px, transparent 0.5px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.1) 0.5px, transparent 0.5px);
  background-size: 20px 20px; /* Taille des carreaux */
}
</style>
0.5