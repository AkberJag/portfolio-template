<script setup>
import { Palette } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted } from 'vue'
import ThemeSwitcher from './ThemeSwitcher.vue';
import AccentColorPicker from './AccentColorPicker.vue';
import ScrollBarToggle from './ScrollBarToggle.vue';
import LanguageSwitcher from './LanguageSwitcher.vue';

const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const closePopover = (event) => {
  if (isOpen.value && !event.target.closest('.theme-customizer-button') && !event.target.closest('.theme-customizer-popover')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', closePopover)
})

onUnmounted(() => {
  document.removeEventListener('click', closePopover)
})
</script>

<template>
  <div class="relative">
    <button
      class="theme-customizer-button fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg bg-white dark:bg-gray-800 text-primary-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      @click="toggle" aria-haspopup="true" :aria-expanded="isOpen">
      <Palette class="w-6 h-6" />
    </button>
    <Teleport to="body">
      <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-150 ease-in"
        leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
        <div v-if="isOpen"
          class="theme-customizer-popover fixed bottom-20 right-4 w-72 rounded-2xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden"
          role="menu" aria-orientation="vertical" aria-labelledby="theme-menu">
          <div class="p-4 space-y-6" role="none">
            <div>
              <ThemeSwitcher />
            </div>
            <div>
              <AccentColorPicker />
            </div>
            <div>
              <ScrollBarToggle />
            </div>
            <div>
              <LanguageSwitcher />
            </div>
          </div>
          <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 text-xs text-gray-500 dark:text-gray-400">
            {{ $t('settings.customize.label') }}
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
