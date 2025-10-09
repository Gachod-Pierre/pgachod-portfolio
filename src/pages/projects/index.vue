<script setup lang="ts">
import { ref, onMounted, watch, nextTick, onUnmounted } from 'vue'
import { pb } from '@/backend'
import gsap from 'gsap'
import { RouterLink } from 'vue-router'
import ImgPb from '@/components/ImgPb.vue'


const projects = ref<any[]>([])
const grid = ref<HTMLElement | null>(null)
let ctx: gsap.Context | null = null

async function loadProjects() {
  console.log('→ loadProjects lancé')
  projects.value = await pb.collection('projets').getFullList({
  sort: '-dateProjet',
});
  console.log('→ projets chargés :', projects.value.length)
}

watch(projects, async (newVal) => {
  if (newVal.length > 0) {
    await nextTick();
    animateCards();
    addHoverAnimations();
  }
});


import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

function animateCards() {
  if (!grid.value) return
  const cards = Array.from(grid.value.querySelectorAll('.project-card'))

  ctx = gsap.context(() => {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 120, scale: 0.9, rotateY: 15 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotateY: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.2,
        scrollTrigger: {
          trigger: grid.value,
          start: 'top bottom', // déclenche les animations quand la grille entre dans le viewport
          end: 'bottom top',
          toggleActions: 'play none none none',
        },
      }
    )
  }, grid)
}



function addHoverAnimations() {
  const cards = grid.value?.querySelectorAll('.project-card');
  if (!cards) return;

  cards.forEach((card) => {
    let hoverTween: gsap.core.Tween | null = null;

    const magneticMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      gsap.to(card, {
        x: x * 0.2,
        y: y * 0.2 - 10, // garde l'élévation initiale
        rotateX: -y * 0.05,
        rotateY: x * 0.05,
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out',
      });
    };

    const resetCard = () => {
      gsap.to(card, {
        x: 0,
        y: 0,
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        boxShadow: '0 0px 0px rgba(0,0,0,0)',
        duration: 0.5,
        ease: 'power2.out',
      });
      card.removeEventListener('mousemove', magneticMove);
    };

    card.addEventListener('mouseenter', () => {
      hoverTween?.kill();
      // scale et shadow
      gsap.to(card, {
        y: -10,
        scale: 1.05,
        boxShadow: '0 15px 40px rgba(0,0,0,0.3)',
        duration: 0.4,
        ease: 'power2.out',
      });
      // activation immédiate de l'effet magnétique
      card.addEventListener('mousemove', magneticMove);
    });

    card.addEventListener('mouseleave', () => {
      hoverTween?.kill();
      resetCard();
    });
  });
}


onMounted(loadProjects)
onUnmounted(() => ctx?.revert())
</script>

<template>
  <div ref="grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <RouterLink
      v-for="project in projects"
      :key="project.id"
      :to="`/projects/${project.id}`"
      class="project-card w-full h-fit block rounded-lg shadow-lg"
    >
      <h2 class="font-semibold text-lg mb-1 text-gray-800">{{ project.nomProjet }}</h2>
      <ImgPb
        class="border-2 border-purple-500"
        :record="project"
        :filename="project.imageProjet[0]"
      />
    </RouterLink>
  </div>
</template>
