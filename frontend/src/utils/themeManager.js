export const Theme = {
  DARK: 'dark',
  LIGHT: 'light',
  SYSTEM: 'system',
}

function getSystemTheme() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? Theme.DARK
    : Theme.LIGHT
}

function applyTheme(theme) {
  const effectiveTheme = theme === Theme.SYSTEM ? getSystemTheme() : theme
  const isDark = effectiveTheme === Theme.DARK
  document.documentElement.classList.toggle('dark', isDark)
}

export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme')
  const theme = Object.values(Theme).includes(savedTheme)
    ? savedTheme
    : Theme.DARK

  applyTheme(theme)

  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (theme === Theme.SYSTEM) {
        applyTheme(Theme.SYSTEM)
      }
    })
  }
}
