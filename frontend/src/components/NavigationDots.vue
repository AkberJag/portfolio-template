<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

const props = defineProps({
  sections: {
    type: Array,
    required: true,
    validator: (value) => value.every(section => 'translationKey' in section || 'name' in section)
  },
  activeSection: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['navigate'])
const hoveredIndex = ref(null)
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
  clearTimeout(labelTimer.value)
})

const handleScroll = () => hoveredIndex.value = null
const handleTouchStart = (e) => {
  const nav = document.getElementById('section-nav')
  if (nav && !nav.contains(e.target)) hoveredIndex.value = null
}

const getDotClasses = (index) => ({
  'rounded-full transition-all duration-300 ease-in-out': true,
  'bg-primary w-4 h-4': props.activeSection === index || hoveredIndex.value === index,
  'bg-primary-200 w-2 h-2': props.activeSection !== index && hoveredIndex.value !== index,
  'hover:bg-primary-400 hover:w-3 hover:h-3': !isTouchDevice.value &&
    props.activeSection !== index &&
    hoveredIndex.value !== index
})

const navigateToSection = (index) => {
  if (index === props.activeSection) return
  emit('navigate', index)
  if (isTouchDevice.value) {
    hoveredIndex.value = index
    setTimeout(() => hoveredIndex.value = null, 1500)
  }
}

// Get the translated section name
const getSectionName = (section) => {
  if (section.translationKey) {
    return t(section.translationKey + '.name')
  }
  return section.name
}

// Get localized navigation label
const getNavigationAriaLabel = (section) => {
  const sectionName = getSectionName(section)
  return t('aria.navigateToSection', { section: sectionName })
}

watch(() => props.activeSection, (newVal, oldVal) => {
  if (newVal === oldVal) return
  showLabel.value = true
  clearTimeout(labelTimer.value)
  labelTimer.value = setTimeout(() => {
    showLabel.value = false
    hoveredIndex.value = null
  }, 1000)
})
</script>

<template>
  <nav id="section-nav" class="fixed right-6 top-1/2 -translate-y-1/2 z-50" aria-label="Section navigation">
    <ul class="flex flex-col items-center space-y-4">
      <li v-for="(section, index) in sections" :key="index" class="relative group">
        <div class="w-4 h-4 flex items-center justify-center">
          <button @click="navigateToSection(index)" @mouseenter="!isTouchDevice && (hoveredIndex = index)"
            @mouseleave="!isTouchDevice && (hoveredIndex = null)" :class="getDotClasses(index)"
            :aria-label="getNavigationAriaLabel(section)"
            :aria-current="activeSection === index ? 'page' : undefined" />
        </div>
        <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 -translate-x-2"
          leave-active-class="transition ease-in duration-300" leave-to-class="opacity-0 -translate-x-2">
          <div v-if="hoveredIndex === index || (activeSection === index && showLabel)"
            class="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap">
            <span class="px-2 py-1 text-sm font-medium bg-primary rounded-md shadow-md text-white">
              {{ getSectionName(section) }}
            </span>
          </div>
        </Transition>
      </li>
    </ul>
  </nav>
</template>
