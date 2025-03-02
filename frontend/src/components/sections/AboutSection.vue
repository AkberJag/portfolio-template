<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="flex justify-center items-center min-h-screen w-full p-4">
    <div class="max-w-2xl text-center px-4">
      <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6">
        {{ t('sections.about.heading') }}
      </h2>
      <p class="text-sm md:text-lg text-gray-600 dark:text-gray-300">
        {{ t('sections.about.description') }}
      </p>
    </div>
  </div>
</template>
