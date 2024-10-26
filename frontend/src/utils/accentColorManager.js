import colors from 'tailwindcss/colors'

export function loadSavedColor() {
  const savedColor = localStorage.getItem('accentColor') || 'yellow'
  applyColor(savedColor)
  return savedColor
}

export function applyColor(colorName) {
  const colorShades = colors[colorName]
  Object.entries(colorShades).forEach(([shade, value]) => {
    document.documentElement.style.setProperty(`--primary-${shade}`, value)
  })
}

export function saveColor(colorName) {
  localStorage.setItem('accentColor', colorName)
  applyColor(colorName)
}
