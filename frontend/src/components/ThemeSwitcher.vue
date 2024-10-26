<script setup>
import { Moon, Sun, Laptop } from 'lucide-vue-next'
import { Theme, useTheme } from '@/utils/themeManager.js'

const themeOptions = [
    { icon: Sun, value: Theme.LIGHT },
    { icon: Moon, value: Theme.DARK },
    { icon: Laptop, value: Theme.SYSTEM },
]

const { theme, displayTheme, setTheme } = useTheme()
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