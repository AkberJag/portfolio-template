<script setup>
import { useColorStore } from '@/stores/colorStore';

const colorStore = useColorStore()

const getButtonClass = (color) => [
    'relative w-4 h-4 border-0 ring-[var(--p-primary-color)]',
    { 'ring-2 ring-offset-2 ring-offset-gray-500': color === colorStore.selectedColor }
]
</script>

<template>
    <div class="w-full space-y-2">
        <span class="text-sm font-medium dark:text-gray-400 capitalize">
            Accent Color ({{ colorStore.selectedColor }})
        </span>
        <div class="flex flex-wrap gap-2">
            <Button v-for="color in colorStore.validColors" :key="color" severity="secondary" rounded icon="pi"
                :class="getButtonClass(color)" :style="{ backgroundColor: `var(--p-${color}-500)` }"
                v-tooltip.top="{ value: color, showDelay: 200 }" @click="colorStore.setSelectedColor(color)" />
        </div>
    </div>
</template>