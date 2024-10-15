<script setup>
import { onUnmounted, computed } from 'vue';
import { useThemeStore } from '@/stores/themeStore';

const themeStore = useThemeStore()

const displayTheme = computed(() => {
    if (themeStore.theme === 'system') {
        return `system - ${themeStore.effectiveTheme}`
    }
    return themeStore.theme
})

onUnmounted(() => {
    themeStore.cleanUp()
})
</script>

<template>
    <div class="flex flex-col space-y-3">
        <span class="text-sm font-medium dark:text-gray-400 capitalize">
            Theme ({{ displayTheme }})
        </span>
        <div class="flex space-x-2">
            <button v-for="option in themeStore.themeOptions" :key="option.value"
                @click="themeStore.setTheme(option.value)" :class="[
                    'p-2 rounded-md transition-colors',
                    themeStore.theme === option.value
                        ? 'bg-primary-400 dark:bg-primary-600 text-primary-foreground '
                        : 'dark:hover:bg-primary-700 hover:bg-primary-200 '
                ]" v-tooltip.top="{ value: option.value, showDelay: 500 }"
                :aria-label="`Select ${option.value} theme`">
                <component :is="option.icon" size="1.1em" />
            </button>
        </div>
    </div>
</template>