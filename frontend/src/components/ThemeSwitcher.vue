<script setup>
import { ref, computed } from 'vue'
import { Moon, Sun, Laptop } from 'lucide-vue-next'

const themeOptions = [
    { icon: Sun, value: 'light' },
    { icon: Moon, value: 'dark' },
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

const displayTheme = computed(() => {
    if (theme.value === 'system') {
        return `System (${effectiveTheme.value})`
    }
    return theme.value.charAt(0).toUpperCase() + theme.value.slice(1)
})

function applyTheme() {
    const isDark = effectiveTheme.value === 'dark'
    document.documentElement.classList.toggle('dark', isDark)
}

function setTheme(newTheme) {
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