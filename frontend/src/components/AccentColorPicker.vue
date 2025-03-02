<script setup>
import { CheckIcon } from 'lucide-vue-next'
import colors from 'tailwindcss/colors'
import { validColors, useAccentColor } from '@/utils/accentColorManager.js'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { selectedColor, displayColor, setAccentColor } = useAccentColor()

const getButtonClass = (color) => ({
  'ring-2 ring-offset-2 ring-white dark:ring-gray-900': color === selectedColor.value
})

// Function to get localized color name
const getLocalizedColorName = (color) => {
  return t(`settings.accentColor.${color.toLowerCase()}`)
}
</script>

<template>
  <div class="w-full space-y-3">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
        {{ $t('settings.accentColor.label') }}:
        <span class="font-semibold text-primary capitalize">
          {{ getLocalizedColorName(displayColor) }}
        </span>
      </span>
    </div>
    <div class="grid grid-cols-8 gap-2">
      <button v-for="color in validColors" :key="color"
        class="w-6 h-6 rounded-full transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-900"
        :class="getButtonClass(color)" :style="{ backgroundColor: colors[color][500] }"
        :aria-label="$t('aria.selectColor', { color: getLocalizedColorName(color) })" @click="setAccentColor(color)">
        <CheckIcon v-if="color === selectedColor" class="w-3 h-3 text-white mx-auto" />
      </button>
    </div>
  </div>
</template>
