<script setup lang="ts">
import { ref, computed } from 'vue'
import logo from '@/components/icons/logo-site.vue'
import { RouterLink } from 'vue-router'
import Button from './Button.vue'
import GithubLogo from './icons/githubLogo.vue'

const activeMenu = ref(false)

// Computed property pour l'URL du CV
const cvUrl = computed(() => {
  return new URL('@/assets/cv-pierre-gachod.pdf', import.meta.url).href
})

function closeMenu() {
  activeMenu.value = false
}
</script>

<template>
  <header
    class="flex items-center justify-between py-8 bg-transparent h-20 lg:w-[300px] lg:h-[100vh] lg:fixed lg:top-0 lg:right-0 lg:shadow-nav lg:overflow-hidden lg:px-[50px] lg:py-[50px] lg:flex-col lg:gap-6 lg:items-center lg:bg-neutral-900 lg:flex"
    :class="{ '!bg-black': activeMenu }"
  >
    <RouterLink to="/" @click="closeMenu" class="flex justify-center items-center">
      <logo class="h-[50px] w-[42px] lg:h-[100px] lg:w-[84px]" />
    </RouterLink>
    <button
      class="relative z-10 flex h-3 w-6 flex-col justify-between lg:hidden *:block *:ease *:h-[2px] *:w-full *:transform *:rounded-full *:bg-white *:transition *:duration-300"
      @click="activeMenu = !activeMenu"
    >
      <span :class="{ 'translate-y-[5px] rotate-45': activeMenu }"></span>
      <span :class="{ '-translate-y-[5px] -rotate-45': activeMenu }"></span>
    </button>

    <nav
      class="text-center place-items-center text-3xl py-12 md:gap-[16vh] flex justify-between mt-20 flex-col fixed z-10 inset-0 bg-black transform translate-x-full transition-transform duration-300 ease-in-out lg:mt-0 lg:text-xl lg:static lg:bg-transparent lg:py-6 lg:translate-x-0 lg:transition-none"
      :class="{ '!translate-x-0': activeMenu }"
      v-scroll-lock="activeMenu"
    >
      <ul class="flex flex-col gap-4 lg:border-l lg:px-6 lg:border-white lg:flex-col">
        <li>
          <RouterLink
            class="ease-in-out duration-300 hover:scale-105 block p-4 rounded-lg text-white"
            to="/"
            @click="closeMenu"
          >
            <span :class="{ 'text-purple-500': $route.path === '/' }">Home</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="ease-in-out duration-300 hover:scale-105 block p-4 rounded-lg text-white"
            to="/projects"
            @click="closeMenu"
          >
            <span :class="{ 'text-purple-500': $route.path === '/projects' }">My projects</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            class="ease-in-out duration-300 hover:scale-105 block p-4 rounded-lg text-white"
            to="/contact"
            @click="closeMenu"
          >
            <span :class="{ 'text-purple-500': $route.path === '/contact' }">Contact Me</span>
          </RouterLink>
        </li>
        <li>
          <!-- Affichage pour desktop (iframe) -->
          <RouterLink
            class="ease-in-out duration-300 hover:scale-105 block p-4 rounded-lg text-white hidden sm:block"
            to="/CV"
            @click="closeMenu"
          >
            <span :class="{ 'text-purple-500': $route.path === '/CV' }">CV</span>
          </RouterLink>

          <!-- Affichage pour mobile (nouvel onglet) -->
          <a
            class="ease-in-out duration-300 hover:scale-105 block p-4 rounded-lg text-white sm:hidden"
            :href="cvUrl"
            target="_blank"
            rel="noopener noreferrer"
            @click="closeMenu"
          >
            <span>CV</span>
          </a>
        </li>
      </ul>
      <Button
        class="hover:bg-purple-500 w-fit h-fit flex"
        text="Connection"
        variant="github"
        size="small"
        url="/"
        :icon="GithubLogo"
      />
    </nav>
  </header>
</template>
