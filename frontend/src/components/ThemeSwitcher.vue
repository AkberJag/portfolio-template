<script setup>
import { ref, computed } from 'vue'
import { Moon, Sun, Laptop } from 'lucide-vue-next'

const Theme = {
    DARK: 'dark',
    LIGHT: 'light',
    SYSTEM: 'system'
}

Object.freeze(Theme)

const themeOptions = [
    { icon: Sun, value: Theme.LIGHT },
    { icon: Moon, value: Theme.DARK },
    { icon: Laptop, value: Theme.SYSTEM },
]

// Validate theme from localStorage
const savedTheme = localStorage.getItem('theme')
const theme = ref(Object.values(Theme).includes(savedTheme) ? savedTheme : Theme.DARK)

function getSystemTheme() {
    const prefersDark = typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
    const systemTheme = prefersDark ? Theme.DARK : Theme.LIGHT
    return Object.values(Theme).includes(systemTheme) ? systemTheme : Theme.DARK
}

const systemTheme = ref(getSystemTheme())

const effectiveTheme = computed(() => {
    return theme.value === Theme.SYSTEM ? systemTheme.value : theme.value
})

const displayTheme = computed(() => {
    if (theme.value === Theme.SYSTEM) {
        return `System (${effectiveTheme.value})`
    }
    return theme.value.charAt(0).toUpperCase() + theme.value.slice(1)
})

function applyTheme() {
    const isDark = effectiveTheme.value === Theme.DARK
    document.documentElement.classList.toggle('dark', isDark)
}

function setTheme(newTheme) {
    if (!Object.values(Theme).includes(newTheme)) {
        newTheme = Theme.DARK
    }
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    applyTheme()
}
</script>

<template>
    <div class="flex flex-col space-y-2">
        <span class="text-sm font-medium text-gray-600 dark:text-gray-300">
            Theme: <span class="font-semibold text-gray-900 dark:text-white">{{ displayTheme }}</span>
        </span>
        <div class="flex space-x-1">
            <button v-for="option in themeOptions" :key="option.value" @click="setTheme(option.value)" :class="[
                'p-1.5 rounded-md transition-all duration-200 ease-in-out',
                theme === option.value
                    ? 'bg-white dark:bg-gray-600 text-primary-500 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            ]" :aria-label="`Select ${option.value} theme`">
                <component :is="option.icon" size="1.2em" />
            </button>
        </div>
    </div>
</template>