import { defineStore } from 'pinia'
import { ref } from 'vue'
import { updatePrimaryPalette, palette } from '@primevue/themes'

export const useColorStore = defineStore('color', () => {
  const validColors = [
    'emerald',
    'green',
    'lime',
    'red',
    'orange',
    'amber',
    'yellow',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
  ]
  const DEFAULT_COLOR = validColors[6]

  const selectedColor = ref(DEFAULT_COLOR)

  const setSelectedColor = color => {
    if (validColors.includes(color)) {
      selectedColor.value = color
      localStorage.setItem('selectedColor', color)
      applyColor(color)
    } else {
      selectedColor.value = DEFAULT_COLOR
      localStorage.setItem('selectedColor', DEFAULT_COLOR)
      applyColor(DEFAULT_COLOR)
    }
  }

  const applyColor = color => {
    updatePrimaryPalette(palette(`{${color}}`))
  }

  const initializeColor = () => {
    const storedColor = localStorage.getItem('selectedColor')
    setSelectedColor(storedColor || DEFAULT_COLOR)
  }

  return {
    validColors,
    selectedColor,
    setSelectedColor,
    initializeColor,
  }
})
