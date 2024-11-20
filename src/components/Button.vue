<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'outlined' | 'white' | 'github'
    size?: 'small' | 'medium' | 'large'
    url?: string
    text?: string
    icon?: string | object | undefined
  }>(),
  { variant: 'default', size: 'medium' }
)

const variantClass = {
  default: 'bg-teal-700 text-white',
  outlined: 'border-2 border-white',
  white: 'bg-white text-black text-xl',
  github: 'bg-purple-700 text-white'
}

const sizeClass = {
  small: 'px-4 py-3 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-base'
}
</script>

<template>
  <RouterLink
    class="flex justify-center items-center relative overflow-hidden gap-3 rounded-xl text-base font-bold text-center"
    :class="[variantClass[props.variant], sizeClass[props.size]]"
    :to="`${url}`"
  >
    <component
      :is="props.icon"
      :class="props.variant === 'outlined' ? 'stroke-teal-700' : 'stroke-white'"
    />
    {{ text }}
  </RouterLink>
</template>
