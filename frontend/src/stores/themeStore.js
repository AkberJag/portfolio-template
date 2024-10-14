import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Moon, Sun, Laptop } from 'lucide-vue-next'

export const useThemeStore = defineStore('theme', () => {
  const themeOptions = [
    { icon: Moon, value: 'dark' },
    { icon: Sun, value: 'light' },
    { icon: Laptop, value: 'system' },
  ]

  const theme = ref(localStorage.getItem('theme') || 'dark')
  const systemTheme = ref(getSystemTheme())

  function getSystemTheme() {
    return typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  const effectiveTheme = computed(() => {
    return theme.value === 'system' ? systemTheme.value : theme.value
  })

  const applyTheme = () => {
    const isDark = effectiveTheme.value === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
  }

  const setTheme = newTheme => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
  }

  // Apply theme initially
  applyTheme()

  // Set up system theme change listener
  let mediaQuery
  if (typeof window !== 'undefined') {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      systemTheme.value = getSystemTheme()
      if (theme.value === 'system') {
        applyTheme()
      }
    })
  }

  // Clean up listener when store is no longer used
  const cleanUp = () => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', applyTheme)
    }
  }

  return {
    theme,
    themeOptions,
    setTheme,
    applyTheme,
    cleanUp,
    effectiveTheme,
  }
})
