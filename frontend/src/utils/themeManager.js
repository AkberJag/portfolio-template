function getSystemTheme() {
  return typeof window !== 'undefined' &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyTheme(theme) {
  const effectiveTheme = theme === 'system' ? getSystemTheme() : theme
  const isDark = effectiveTheme === 'dark'
  document.documentElement.classList.toggle('dark', isDark)
}

export function initializeTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark'
  applyTheme(savedTheme)

  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', () => {
      if (savedTheme === 'system') {
        applyTheme('system')
      }
    })
  }
}
