<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
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
  <select :value="locale" @change="updateLocale($event.target.value)">
    <option v-for="lang in languages" :key="lang.code" :value="lang.code">
      {{ lang.name }}
    </option>
  </select>
</template>
