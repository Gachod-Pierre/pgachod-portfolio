<template>
  <!-- Header avec bouton retour -->
  <div class="mx-0 pt-14">
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


  <!-- SECTION TITRE ANIMÉE -->

  <section ref="titleSection" class="relative w-full py-16 md:py-20 overflow-visible">
    <!-- Orbes décoratives -->
    <div
      :class="[
        'absolute top-[-25vh] left-[-20vw] w-[50vw] h-[50rem] bg-purple-500/20 rounded-full blur-3xl mix-blend-screen pointer-events-none transition-opacity duration-[1s] ease-out',
        orbVisible ? 'opacity-100' : 'opacity-0'
      ]"
    ></div>

    <!-- Titre -->
    <h1 ref="title" class="text-5xl md:text-8xl font-extrabold text-white text-nowrap relative">
      <span
        v-for="(letter, index) in letters"
        :key="index"
        class="inline-block opacity-0 translate-y-10"
      >
        {{ letter }}
      </span>
    </h1>

    <!-- Ligne décorative -->
    <div ref="underline" class="w-0 h-1 bg-purple-500 mt-4 rounded-full"></div>
  </section>

  <!-- GRID DE PROJETS -->
  <div ref="grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
    <RouterLink
      v-for="project in projects"
      :key="project.id"
      :to="`/projects/${project.slug ?? slugify(project.nomProjet)}`"
      class="project-card relative w-full h-fit block rounded-lg shadow-lg overflow-hidden"
    >
      <!-- Image -->
      <ImgPb
        class="border-2 border-purple-500 z-0 relative"
        :record="project"
        :filename="project.imageProjet[0]"
      />

      <!-- Overlay violet -->
      <div
        class="overlay absolute top-0 right-0 h-full w-0 opacity-0 flex flex-col text-center text-white z-20"
      >
        <p class="font-bold text-lg">{{ project.nomProjet }}</p>
        <p class="text-sm">
          {{ new Date(project.dateProjet).toLocaleDateString('fr-FR') }}
        </p>
      </div>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, onUnmounted } from 'vue'
import { pb } from '@/backend'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { RouterLink, useRouter } from 'vue-router'
import ImgPb from '@/components/ImgPb.vue'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const goBack = () => router.back()

const grid = ref<HTMLElement | null>(null)
const projects = ref<any[]>([])
const titleSection = ref<HTMLElement | null>(null)
const title = ref<HTMLElement | null>(null)
const underline = ref<HTMLElement | null>(null)
const letters = ref('My\u00A0Projects'.split(''))
const orbVisible = ref(false)

let ctx: gsap.Context | null = null

// Charger les projets
async function loadProjects() {
  projects.value = await pb.collection('projets').getFullList({ sort: '-dateProjet' })
}

// Attendre le chargement des images
async function waitForImages() {
  const images = grid.value?.querySelectorAll('img') || []
  const promises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve()
    return new Promise((resolve) => img.addEventListener('load', resolve))
  })
  await Promise.all(promises)
}

// Animation GSAP du titre "PROJETS"
function animateTitle() {
  const spans = title.value?.querySelectorAll('span') || []

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: titleSection.value,
      start: 'top 80%'
    }
  })

  tl.to(spans, {
    opacity: 1,
    y: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: 'back.out(1.7)'
  })
    .to(
      underline.value,
      {
        width: '120px',
        duration: 0.8,
        ease: 'power4.out'
      },
      '-=0.3'
    )
    .fromTo(
      '.orb',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1.5, ease: 'power2.out', stagger: 0.2 },
      '-=1'
    )

  // --- Effet parallax souris ---
  const handleMouseMove = (e: MouseEvent) => {
    const rect = titleSection.value?.getBoundingClientRect()
    if (!rect) return

    const x = e.clientX - rect.width / 2
    const y = e.clientY - rect.height / 2

    gsap.to('.orb', {
      x: x * 0.05,
      y: y * 0.05,
      duration: 0.6,
      ease: 'power2.out'
    })
  }

  titleSection.value?.addEventListener('mousemove', handleMouseMove)
}

// Animation d’apparition des cartes
function animateCards() {
  if (!grid.value) return
  const cards = Array.from(grid.value.querySelectorAll('.project-card'))

  cards.forEach((card, i) => {
    gsap.to(card, {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      duration: 1.2,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: card,
        start: 'top bottom',
        toggleActions: 'play none none none'
      },
      delay: i * 0.05
    })
  })
}

// Animation hover + overlay violet
function addHoverAnimations() {
  const cards = grid.value?.querySelectorAll('.project-card')
  if (!cards) return

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

  cards.forEach((card) => {
    const overlay = card.querySelector('.overlay') as HTMLElement
    let overlayTween: gsap.core.Tween | null = null
    let originalZIndex = card.style.zIndex || ''

    if (!isTouch && overlay) {
      const magneticMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect()
        const x = e.clientX - (rect.left + rect.width / 2)
        const y = e.clientY - (rect.top + rect.height / 2)

        gsap.to(card, {
          x: x * 0.2,
          y: y * 0.2 - 10,
          rotateX: -y * 0.05,
          rotateY: x * 0.05,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out'
        })
      }

      const resetCard = () => {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        })
        card.removeEventListener('mousemove', magneticMove)

        overlayTween?.kill()
        overlayTween = gsap.to(overlay, {
          width: 0,
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in'
        })

        // Remet l'ancien z-index
        card.style.zIndex = originalZIndex
      }

      card.addEventListener('mouseenter', () => {
        // Met la carte sur le dessus
        card.style.zIndex = '10'

        card.addEventListener('mousemove', magneticMove)

        overlayTween?.kill()
        overlayTween = gsap.to(overlay, {
          width: '50%',
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
      })

      card.addEventListener('mouseleave', resetCard)
    }
  })
}

function slugify(str: string) {
  return String(str)
    .normalize('NFD')                // remove accents
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

onMounted(async () => {
  await loadProjects()
  await nextTick()
  requestAnimationFrame(() => {
    orbVisible.value = true
  })
  await waitForImages()

  const cards = Array.from(grid.value?.querySelectorAll('.project-card') || [])
  gsap.set(cards, { opacity: 0, y: 120, scale: 0.9, rotateY: 15 })

  requestAnimationFrame(() => {
    animateTitle()
    animateCards()
    addHoverAnimations()
    ScrollTrigger.refresh()
  })
})

onUnmounted(() => ctx?.revert())
</script>

<style scoped>
.project-card {
  opacity: 0;
  transform: translateY(120px) scale(0.9) rotateY(15deg);
  transition: none;
}

.overlay {
  overflow: hidden;
  width: 0;
  opacity: 0;
  background-color: #7c3aed; /* purple-500 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  pointer-events: none;
}

.orb {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) translateX(0px);
  }
  50% {
    transform: translateY(-20px) translateX(10px);
  }
}
</style>
