<script setup>
import { onMounted } from 'vue'
import { loadSavedColor } from '@/utils/accentColorManager'
import { initializeTheme } from '@/utils/themeManager'

onMounted(() => {
  loadSavedColor()
  initializeTheme()
})
</script>

<template>
  <router-view />
</template>