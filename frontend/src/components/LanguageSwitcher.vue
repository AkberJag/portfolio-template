<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { ChevronDown } from 'lucide-vue-next'
import languages from '@/i18n/languages.json'
import { SUPPORTED_LOCALES } from '@/i18n'

const router = useRouter()
const { locale } = useI18n()

const updateLocale = async (newLang) => {
  const currentPath = router.currentRoute.value.fullPath
  let newPath = currentPath
  // Handle language prefix
  if (newLang === 'en') {
    newPath = currentPath.replace(/^\/[a-z]{2}\//, '/')
  } else {
    const hasExistingLang = SUPPORTED_LOCALES.some(lang =>
      currentPath.startsWith(`/${lang}/`)
    )
    newPath = hasExistingLang
      ? currentPath.replace(/^\/[a-z]{2}\//, `/${newLang}/`)
      : `/${newLang}${currentPath}`
  }
  router.push(newPath)
  locale.value = newLang
  localStorage.setItem('preferredLocale', newLang)
}
</script>

<template>
  <div class="flex items-center justify-between w-full">
    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
      {{ $t('settings.language.label') }}:
    </span>
    <div class="relative">
      <select :value="locale" @change="updateLocale($event.target.value)"
        class="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm font-medium transition-colors duration-200 hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
        <option v-for="lang in languages" :key="lang.code" :value="lang.code">
          {{ lang.name }}
        </option>
      </select>
      <div
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500 dark:text-gray-400">
        <ChevronDown class="w-4 h-4" />
      </div>
    </div>
  </div>
</template>
