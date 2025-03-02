<script setup>
import { Moon, Sun, Laptop } from 'lucide-vue-next'
import { Theme, useTheme } from '@/utils/themeManager.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const themeOptions = [
  { icon: Sun, value: Theme.LIGHT, label: 'settings.theme.light' },
  { icon: Moon, value: Theme.DARK, label: 'settings.theme.dark' },
  { icon: Laptop, value: Theme.SYSTEM, label: 'settings.theme.system' },
]

const { theme, setTheme } = useTheme()

// Function to get localized theme name
const getLocalizedThemeName = (selectedTheme) => {
  const option = themeOptions.find(opt => opt.value === selectedTheme)
  if (!option) return selectedTheme

  // For system theme, show "System (Light/Dark)"
  if (option.value === Theme.SYSTEM) {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    return t(option.label, { theme: t(`settings.theme.${systemTheme}`) })
  }

  return t(option.label)
}
</script>

<template>
  <div class="flex flex-col space-y-2">
    <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
      {{ $t('settings.theme.label') }}:
      <span class="font-semibold text-gray-900 dark:text-white">
        {{ getLocalizedThemeName(theme) }}
      </span>
    </span>

    <div class="flex space-x-1">
      <button v-for="option in themeOptions" :key="option.value" @click="setTheme(option.value)" :class="[
        'p-1.5 rounded-md transition-all duration-200 ease-in-out',
        theme === option.value
          ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-sm'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
      ]" :aria-label="$t('aria.selectTheme', { theme: getLocalizedThemeName(option.value) })">
        <component :is="option.icon" size="1.2em" />
      </button>
    </div>
  </div>
</template>
