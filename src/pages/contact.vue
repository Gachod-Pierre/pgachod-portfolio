<script setup lang="ts">
import { ref } from 'vue'
import emailjs from 'emailjs-com'

interface FormData {
  lname: string
  fname: string
  email: string
  subject: string
  message: string
  [key: string]: string
}

const formData = ref<FormData>({
  lname: '',
  fname: '',
  email: '',
  subject: '',
  message: ''
})

const fields = [
  { name: 'lname', type: 'text', label: 'Nom' },
  { name: 'fname', type: 'text', label: 'Prénom' },
  { name: 'email', type: 'email', label: 'Adresse mail' },
  {
    name: 'subject',
    type: 'custom-select',
    label: 'Sujet',
    options: ['Collaboration', 'Question', 'Problème technique', "Retour d'expérience", 'Autre']
  },
  { name: 'message', type: 'textarea', label: 'Dites nous...' }
]

const isDropdownOpen = ref(false)
const selectedOption = ref('')

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const selectOption = (option: string, event: Event) => {
  event.stopPropagation()
  selectedOption.value = option
  formData.value.subject = option
  isDropdownOpen.value = false
}

const sendEmail = () => {
  emailjs.send('service_5eodjiv', 'template_a8lynwv', formData.value, 'oqwwwOKPcLfPJlMV-').then(
    (response) => {
      console.log('SUCCESS!', response.status, response.text)
    },
    (error) => {
      console.log('FAILED...', error)
    }
  )
}

const adjustTextareaHeight = (event: Event) => {
  const textarea = event.target as HTMLTextAreaElement
  textarea.style.height = 'auto' // Réinitialise la hauteur
  textarea.style.height = `${textarea.scrollHeight}px` // Ajuste à la hauteur du contenu
}
</script>

<template>
  <section class="flex justify-center items-center min-h-screen text-white">
    <div class="container mx-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-[3vw]">
        <div class="flex flex-col gap-14">
          <div class="relative flex justify-between items-center w-full">
            <h1 class="text-[34px] border-b-2 pb-3 border-[#7E22CE]">Contact</h1>
          </div>
          <p class="mb-10">
            Envie de collaborer ? Un retour constructif ? une question ? N'hésitez pas à m'en faire
            part grâce à ce formulaire de contact !
          </p>
        </div>
        <form @submit.prevent="sendEmail" class="space-y-6">
          <div v-for="(field, index) in fields" :key="index" class="relative">
            <template v-if="field.type === 'custom-select'">
              <div
                class="custom-select-box"
                @click="toggleDropdown"
                :aria-expanded="isDropdownOpen"
              >
                <div class="selected-option">
                  {{ selectedOption || 'Sélectionnez une option' }}
                </div>
                <span class="arrow"></span>
                <div class="dropdown" v-if="isDropdownOpen">
                  <div
                    v-for="option in field.options"
                    :key="option"
                    class="dropdown-option"
                    @click="selectOption(option, $event)"
                  >
                    {{ option }}
                  </div>
                </div>
              </div>
              <label
                :for="field.name"
                class="absolute top-0 left-0 text-base font-light lg:text-xl transition-all"
                :class="{ '-top-6 text-sm': formData[field.name] }"
              >
                {{ field.label }}
              </label>
            </template>
            <template v-else-if="field.type === 'textarea'">
              <textarea
                v-model="formData[field.name]"
                :id="field.name"
                :name="field.name"
                class="mt-1 block w-full p-2 border-b border-[#7E22CE] bg-transparent focus:outline-none placeholder-transparent"
                placeholder=" "
                required
                @input="adjustTextareaHeight"
              ></textarea>
              <label
                :for="field.name"
                class="absolute top-0 left-0 text-base font-light lg:text-xl transition-all"
                :class="{ '-top-6 text-sm': formData[field.name] }"
              >
                {{ field.label }}
              </label>
            </template>
            <template v-else>
              <input
                v-model="formData[field.name]"
                :type="field.type"
                :id="field.name"
                :name="field.name"
                class="mt-1 block w-full p-2 border-b border-[#7E22CE] bg-transparent focus:outline-none placeholder-transparent"
                placeholder=" "
                required
              />
              <label
                :for="field.name"
                class="absolute top-0 left-0 text-base font-light lg:text-xl transition-all"
                :class="{ '-top-6 text-sm': formData[field.name] }"
              >
                {{ field.label }}
              </label>
            </template>
          </div>
          <div class="flex justify-center items-center">
            <button type="submit" class="mb-8 lg:mb-6 bg-[#7E22CE] text-white py-2 px-4 rounded">
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<style scoped>
input:focus + label,
input:not(:placeholder-shown) + label,
textarea:focus + label,
textarea:not(:placeholder-shown) + label,
select:focus + label,
select:not(:placeholder-shown) + label {
  transform: translateY(-1.5rem);
  font-size: 0.85rem;
  color: #7e22ce;
}

label {
  position: absolute;
  top: 0.5rem;
  left: 0.75rem;
  pointer-events: none;
  transition: all 0.2s ease-out;
}

.custom-select-box {
  position: relative;
  border: 1px solid #7e22ce;
  padding: 0.5rem;
  margin-top: 3rem;
  border-radius: 0.25rem;
  cursor: pointer;
  background-color: transparent;
  color: white;
}

.selected-option {
  padding: 0.5rem;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #1f2937;
  border: 1px solid #7e22ce;
  border-bottom-left-radius: 0.25rem;
  border-bottom-right-radius: 0.25rem;
  z-index: 10;
}

.dropdown-option {
  padding: 0.5rem;
  cursor: pointer;
}

.dropdown-option:hover {
  background-color: #7e22ce;
}

.custom-select-box + label {
  top: -1.5rem;
  left: 0.75rem;
  font-size: 0.85rem;
  color: #7e22ce;
}

.arrow {
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #fff;
  transition: transform ease-in-out 0.3s;
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.custom-select-box[aria-expanded='true'] .arrow {
  transform: translateY(-50%) rotate(180deg);
}

textarea {
  resize: none; /* Désactive le redimensionnement manuel */
  overflow-y: hidden; /* Cache le défilement vertical */
  width: 100%; /* Assure que la largeur reste fixe */
  min-height: 2.5rem; /* Définit une hauteur minimale égale à celle des autres champs */
  line-height: 1.5rem; /* Assure un espacement cohérent du texte */
  padding: 0.5rem; /* Même padding que les autres champs */
  max-height: 10rem; /* Réduit la hauteur maximale pour éviter que le titre soit affecté */
  border-bottom: 1px solid #7e22ce; /* Assure une cohérence visuelle avec les autres champs */
  background-color: transparent; /* Même style de fond */
}
</style>
