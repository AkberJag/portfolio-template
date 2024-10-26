// accentColorUtils.js
import { ref, computed } from 'vue'
import colors from 'tailwindcss/colors'

export const validColors = [
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

const DEFAULT_COLOR = 'yellow'

function isValidColor(color) {
  return validColors.includes(color) && colors[color] && colors[color][500]
}

export function applyColor(colorName) {
  if (!isValidColor(colorName)) {
    console.warn(
      `Invalid color: ${colorName}. Falling back to ${DEFAULT_COLOR}`,
    )
    colorName = DEFAULT_COLOR
  }

  const colorShades = colors[colorName]
  Object.entries(colorShades).forEach(([shade, value]) => {
    document.documentElement.style.setProperty(`--primary-${shade}`, value)
  })
}

export function loadSavedColor() {
  const savedColor = localStorage.getItem('accentColor')
  const validatedColor = isValidColor(savedColor) ? savedColor : DEFAULT_COLOR

  if (savedColor !== validatedColor) {
    localStorage.setItem('accentColor', validatedColor)
  }

  applyColor(validatedColor)
  return validatedColor
}

// Alias for loadSavedColor to maintain consistency with theme manager
export const initializeAccentColor = loadSavedColor

export function saveColor(colorName) {
  if (!isValidColor(colorName)) {
    console.warn(
      `Invalid color: ${colorName}. Falling back to ${DEFAULT_COLOR}`,
    )
    colorName = DEFAULT_COLOR
  }

  localStorage.setItem('accentColor', colorName)
  applyColor(colorName)
}

export function useAccentColor() {
  const selectedColor = ref(loadSavedColor())

  function setAccentColor(colorName) {
    if (!isValidColor(colorName)) {
      console.warn(
        `Invalid color: ${colorName}. Falling back to ${DEFAULT_COLOR}`,
      )
      colorName = DEFAULT_COLOR
    }

    selectedColor.value = colorName
    saveColor(colorName)
  }

  const displayColor = computed(() => {
    return (
      selectedColor.value.charAt(0).toUpperCase() + selectedColor.value.slice(1)
    )
  })

  return {
    selectedColor,
    displayColor,
    setAccentColor,
    validColors,
  }
}
