<template>
    <div class="fixed right-6 top-1/2 transform -translate-y-1/2 z-50">
        <div class="flex flex-col items-center space-y-4">
            <div v-for="section in sections" :key="section.path" class="relative group">
                <div class="w-4 h-4 flex items-center justify-center">
                    <button @click="navigateToSection(section.path)" @mouseenter="hoveredDot = section.path"
                        @mouseleave="hoveredDot = null"
                        class="rounded-full transition-all duration-300 ease-in-out focus:outline-none" :class="[
                            currentSection === section.path || hoveredDot === section.path
                                ? 'bg-primary w-4 h-4'
                                : 'bg-primary-200 hover:bg-primary-400 w-2 h-2'
                        ]" :aria-label="`Navigate to ${section.name}`"></button>
                </div>
                <Transition enter-active-class="transition ease-out duration-300"
                    enter-from-class="opacity-0 -translate-x-2" enter-to-class="opacity-100 translate-x-0"
                    leave-active-class="transition ease-in duration-300" leave-from-class="opacity-100 translate-x-0"
                    leave-to-class="opacity-0 -translate-x-2">
                    <div v-if="hoveredDot === section.path || (currentSection === section.path && showLabel)"
                        class="absolute right-full mr-4 top-1/2 transform -translate-y-1/2 whitespace-nowrap">
                        <span
                            class="px-2 py-1 text-sm font-medium bg-primary rounded-md shadow-md text-white dark:bg-gray-800 dark:text-gray-200">
                            {{ section.name }}
                        </span>
                    </div>
                </Transition>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    sections: {
        type: Array,
        required: true
    },
    currentSection: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['navigate'])

const hoveredDot = ref(null)
const showLabel = ref(false)
let labelTimer = null

const navigateToSection = (path) => {
    emit('navigate', path)
}

watch(() => props.currentSection, (newSection, oldSection) => {
    if (newSection !== oldSection) {
        showLabel.value = true
        clearTimeout(labelTimer)
        labelTimer = setTimeout(() => {
            showLabel.value = false
        }, 1000)
    }
}, { immediate: true })
</script>