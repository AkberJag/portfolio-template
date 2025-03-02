<script setup>
import { inject } from 'vue'

const showScrollbar = inject('showScrollbar') // Inject the scrollbar state

const toggleScrollbar = () => {
  showScrollbar.value = !showScrollbar.value
}
</script>

<template>
  <div class="flex items-center justify-between">
    <span class="text-sm font-medium text-gray-900 dark:text-gray-100">{{ $t('settings.showScrollbar.label') }}:</span>
    <button @click="toggleScrollbar" class="relative inline-flex h-6 w-11 items-center rounded-full" :class="showScrollbar
      ? 'bg-primary-500 dark:bg-primary-600'
      : 'bg-gray-200 dark:bg-gray-700'
      ">
      <span class="inline-block h-4 w-4 transform rounded-full bg-white transition"
        :class="showScrollbar ? 'translate-x-6' : 'translate-x-1'" />
    </button>
  </div>
</template>

<style>
.scrollbar-hidden {
  /* Firefox */
  scrollbar-width: none;
  /* IE and Edge */
  -ms-overflow-style: none;
}

.scrollbar-hidden::-webkit-scrollbar {
  /* Chrome, Safari, Opera */
  display: none;
}

.scrollbar-visible {
  /* Firefox */
  scrollbar-width: thin;
  /* IE and Edge */
  -ms-overflow-style: auto;
}

.scrollbar-visible::-webkit-scrollbar {
  /* Width of the scrollbar */
  width: 8px;
}

.scrollbar-visible::-webkit-scrollbar-track {
  /* Track color */
  background: rgba(0, 0, 0, 0.1);
}

.scrollbar-visible::-webkit-scrollbar-thumb {
  /* Thumb color */
  background: rgba(0, 0, 0, 0.3);
  border-radius: 4px;
}

.dark .scrollbar-visible::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
}

.dark .scrollbar-visible::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
}
</style>
