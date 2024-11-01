<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
    sections: {
        type: Array,
        required: true,
        validator: (value) => value.every(section =>
            'path' in section && 'name' in section
        )
    },
    currentSection: {
        type: String,
        required: true
    }
})

const emit = defineEmits(['navigate'])

const hoveredDot = ref(null)
const showLabel = ref(false)
const labelTimer = ref(null)
const isTouchDevice = ref(false)

onMounted(() => {
    isTouchDevice.value = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isTouchDevice.value) {
        window.addEventListener('scroll', handleScroll, { passive: true })
        window.addEventListener('touchstart', handleTouchStart, { passive: true })
    }
})

onBeforeUnmount(() => {
    if (isTouchDevice.value) {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('touchstart', handleTouchStart)
    }
    if (labelTimer.value) {
        clearTimeout(labelTimer.value)
    }
})

const handleScroll = () => {
    if (hoveredDot.value) {
        hoveredDot.value = null
    }
}

const handleTouchStart = (event) => {
    const nav = document.getElementById('section-nav')
    if (nav && !nav.contains(event.target)) {
        hoveredDot.value = null
    }
}

const getDotClasses = (sectionPath) => {
    const isActive = props.currentSection === sectionPath
    const isHovered = hoveredDot.value === sectionPath

    return {
        'rounded-full transition-all duration-300 ease-in-out': true,
        'bg-primary w-4 h-4': isActive || isHovered,
        // Only apply hover effect on non-touch devices
        'bg-primary-200 w-2 h-2': !isActive && !isHovered,
        // Hover classes only applied on non-touch devices
        'hover:bg-primary-400 hover:w-3 hover:h-3': !isTouchDevice.value && !isActive && !isHovered
    }
}

const navigateToSection = (path) => {
    if (path === props.currentSection) return
    emit('navigate', path)

    if (isTouchDevice.value) {
        hoveredDot.value = path
        setTimeout(() => {
            hoveredDot.value = null
        }, 1500)
    }
}

const handleMouseEnter = (path) => {
    if (!isTouchDevice.value && hoveredDot.value !== path) {
        hoveredDot.value = path
    }
}

const handleMouseLeave = () => {
    if (!isTouchDevice.value) {
        hoveredDot.value = null
    }
}

watch(() => props.currentSection, (newSection, oldSection) => {
    if (newSection === oldSection) return

    showLabel.value = true

    if (labelTimer.value) {
        clearTimeout(labelTimer.value)
    }

    labelTimer.value = setTimeout(() => {
        showLabel.value = false
        hoveredDot.value = null
    }, 1000)
}, { immediate: true })
</script>

<template>
    <nav id="section-nav" class="fixed right-6 top-1/2 transform -translate-y-1/2 z-50" role="navigation"
        aria-label="Section navigation">
        <ul class="flex flex-col items-center space-y-4" role="list">
            <li v-for="section in sections" :key="section.path" class="relative group">
                <div class="w-4 h-4 flex items-center justify-center">
                    <button @click="navigateToSection(section.path)" @mouseenter="handleMouseEnter(section.path)"
                        @mouseleave="handleMouseLeave" :class="getDotClasses(section.path)"
                        :aria-label="`Navigate to ${section.name}`"
                        :aria-current="currentSection === section.path ? 'page' : undefined" />
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
            </li>
        </ul>
    </nav>
</template>