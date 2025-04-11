<script setup lang="ts">
import { ref, onMounted, onUnmounted, reactive, type Component, defineAsyncComponent } from 'vue'
import { pb } from '@/backend'

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
import IconGit from '@/components/icons/iconGit.vue'
import IconIE from '@/components/icons/iconIE.vue'
import IconNodeJS from '@/components/icons/iconNodeJS.vue'
import IconPB from '@/components/icons/iconPB.vue'
import IconTailwind from '@/components/icons/iconTailwind.vue'
import IconTS from '@/components/icons/iconTS.vue'
import IconWP from '@/components/icons/iconWP.vue'

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

const AsyncCarousel1 = defineAsyncComponent(() => import('@/components/AsyncCarousel1.vue'))
const AsyncCarousel2 = defineAsyncComponent(() => import('@/components/AsyncCarousel2.vue'))

const config = reactive({
  autoplay: 2200,
  wrapAround: true,
  pauseAutoplayOnHover: true,
  autoplayEnabled: false
})

const config2 = reactive({
  autoplay: 2600,
  wrapAround: true,
  autoplayEnabled: false,
  pauseAutoplayOnHover: true
})

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
  { id: 10, name: 'Vue.js', icon: markRaw(IconVue), x: 0, y: 0, visible: false },
  { id: 11, name: 'Git', icon: markRaw(IconGit), x: 0, y: 0, visible: false },
  { id: 12, name: 'IE', icon: markRaw(IconIE), x: 0, y: 0, visible: false },
  { id: 13, name: 'Node Js', icon: markRaw(IconNodeJS), x: 0, y: 0, visible: false },
  { id: 14, name: 'PocketBase', icon: markRaw(IconPB), x: 0, y: 0, visible: false },
  { id: 16, name: 'TypeScript', icon: markRaw(IconTS), x: 0, y: 0, visible: false },
  { id: 15, name: 'Tailwind', icon: markRaw(IconTailwind), x: 0, y: 0, visible: false },
  { id: 17, name: 'Wordpress', icon: markRaw(IconWP), x: 0, y: 0, visible: false }
])

const sectionVisible = ref(false)
const isDragging = ref(false)
const activeSkillId = ref<number | null>(null)
const sectionRef = ref<HTMLElement | null>(null)
const lastTouchPosition = ref<{ x: number; y: number } | null>(null)

const generateRandomPositions = (width: number, height: number, size: number) => {
  const positions: { x: number; y: number }[] = []

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
  const iconSize = window.innerWidth >= 1024 ? 128 : 56

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

const projects = await pb.collection('projets').getFullList()

async function loadProjectImages() {
  try {
    images.value = projects
      .map((project) => {
        const image = project.imageProjet?.[0]
        const imageUrl = image ? pb.getFileUrl(project, image) : null
        console.log('Image URL:', imageUrl) // Log des URL des images
        return imageUrl
      })
      .filter((imageUrl): imageUrl is string => imageUrl !== null)
    config.autoplayEnabled = true
  } catch (error) {
    console.error('Erreur lors du chargement des images de projets:', error)
  }
}

const elementHeight = ref(0)

onMounted(() => {
  loadProjectImages()

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

  const sectionElement = sectionRef.value
  if (sectionElement) {
    const { offsetWidth: sectionWidth, offsetHeight: sectionHeight } = sectionElement
    const iconSize = window.innerWidth >= 1024 ? 128 : 56
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

function scrollToSection() {
  const section = document.getElementById('section2')
  if (section) {
    section.scrollIntoView({ behavior: 'smooth' })
  }
}

const section4Ref = ref<HTMLElement | null>(null)
const charsVisible = ref(false)

useIntersectionObserver(
  section4Ref,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      charsVisible.value = true
    }
  },
  { threshold: 0.5 }
)
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
      class="section-snap snap-start flex flex-col justify-between items-center w-full max-h-full bg-black text-white"
    >
      <div
        class="flex flex-col justify-between car-lg:flex-row max-w-full max-h-full lg:justify-start self-stretch relative md:gap-[50px] gap-8 overflow-hidden"
      >
        <div
          class="flex flex-col justify-start items-start flex-grow relative gap-10 lg:gap-[88px]"
        >
          <h1 class="self-stretch text-left">
            <span class="self-stretch title2">Pierre </span><br />
            <span class="self-stretch title1">Gachod </span>
          </h1>
          <div
            @click="scrollToSection"
            class="flex justify-start items-center self-stretch relative gap-[15px]"
          >
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
        <AsyncCarousel1 />
      </div>
      <Vue3Marquee :pause-on-hover="true" :loop="0" class="border-b flex-grow overflow-hidden">
        <p
          class="flex-grow overflow-hidden text-[10dvh] lg:text-[25vh] font-extrabold text-left text-white"
        >
          WEB DEVELOPER
          <span class="text-[10dvh] lg:text-[25vh] font-thin text-left text-white"
            >SEARCH ENGINE OPTIMISER</span
          >
          DESIGNER
          <span class="text-[10dvh] lg:text-[25vh] font-light text-left text-white"
            >PROJECT MANAGEMENT</span
          >
        </p>
      </Vue3Marquee>
    </section>

    <!-- Section Skills -->
    <section
      id="section2"
      ref="sectionRef"
      class="section-snap snap-start flex flex-col bg-black relative w-full max-h-full"
    >
      <div class="flex justify-between items-center">
        <h2 class="title1 my-6 border-b flex gap-2 border-white w-fit">
          <span class="title1">My</span>
          <span class="title2">Skills</span>
        </h2>
        <iconClic />
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
              <component :is="skill.icon" class="w-14 h-14 lg:w-32 lg:h-32" :title="skill.name" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Section 3 -->

    <section
      class="section-snap snap-start flex flex-col justify-center gap-[7dvh] items-center w-full max-h-full bg-black text-white"
    >
      <h2 class="self-start flex gap-2 text-left border-b border-white w-fit">
        <span class="title3">Lastest</span><br />
        <span class="title4">projects</span>
      </h2>
      <AsyncCarousel2 />
    </section>

    <!-- Section 4 work together -->

    <section
      ref="section4Ref"
      class="section-snap snap-start flex flex-col justify-center gap-[7dvh] items-start w-full max-h-full bg-black text-white"
    >
      <h2 class=" flex flex-col lg:flex-row gap-0 lg:gap-2 text-left border-b border-white w-fit">
        <span class="title3">Let's Work</span><br class="lg:block hidden" />
        <span class="title4">Together !</span>
      </h2>
      <div class="flex justify-center items-center">
        <a href="./contact"
          class="cta relative flex items-center justify-center w-12 h-12 rounded-full border-2 border-white-500 text-white transition-all duration-700 hover:w-44"
        >
          <p class=" opacity-100 transition-opacity duration-500 hover:opacity-0">></p>
          <span
            class="whitespace-nowrap button-text absolute opacity-0 transition-opacity duration-500 w-full left-0 text-center hover:opacity-100"
            >Contact Me</span
          >
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  position: absolute;
  float: none;
  top: 50%;
  left: 50%;
  text-align: center;
}


.cta {
  width: 50px;
  height: 50px;
  border-radius: 50px;
  border: 2px solid rgb(255, 255, 255);
  color: #fff;
  transition: width 0.7s;
  display: flex;
}
.cta:hover {
  width: 180px;
  transition: width 0.7s;
}

.cta p {
  opacity: 1;
  transition: opacity 0.7s;
}

.cta:hover p {
  opacity: 0;
  transition: opacity 0.5s;
}

.cta .button-text {
  opacity: 0;
  transition: opacity 0.3s;
  position: absolute;
  width: 100%;
  left: 0;
}

.cta:hover .button-text {
  opacity: 1;
  transition: opacity 2s;
}

</style>
