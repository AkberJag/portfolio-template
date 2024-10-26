<script setup>
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'

const data = {
    "greeting": "Hey there!",
    "name": "John Doe",
    "secondaryName": "VU3CXF",
    "title": "Web Developer & Designer",
    "subtitle": "Ham Radio Enthusiast"
}

const sections = inject('sections')

const contactSection = computed(() => sections.find(section => section.name === 'Contact'))

const greetingRef = ref(null)
const alternatingTextRef = ref(null)
const contentRef = ref(null)
const showCursor = ref(true)
const showContent = ref(false)
let cursorInterval = null

const typeWriter = (element, text, speed = 100) => {
    let i = 0
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i)
                i++
            } else {
                clearInterval(timer)
                resolve()
            }
        }, speed)
    })
}

const eraseText = (element, speed = 50) => {
    return new Promise((resolve) => {
        const timer = setInterval(() => {
            if (element.textContent.length > 0) {
                element.textContent = element.textContent.slice(0, -1)
            } else {
                clearInterval(timer)
                resolve()
            }
        }, speed)
    })
}

const blinkCursor = () => {
    cursorInterval = setInterval(() => {
        showCursor.value = !showCursor.value
    }, 500)
}

const alternateText = async () => {
    if (data.secondaryName) {
        while (true) {
            await typeWriter(alternatingTextRef.value, data.name, 100)
            await new Promise(resolve => setTimeout(resolve, 5000))
            await eraseText(alternatingTextRef.value)
            await typeWriter(alternatingTextRef.value, data.secondaryName, 100)
            await new Promise(resolve => setTimeout(resolve, 3000))
            await eraseText(alternatingTextRef.value)
        }
    } else {
        await typeWriter(alternatingTextRef.value, data.name, 100)
    }
}

onMounted(async () => {
    blinkCursor()
    await typeWriter(greetingRef.value, data.greeting)
    showContent.value = true
    await new Promise(resolve => setTimeout(resolve, 1000)) // Wait for content to fade in
    alternateText()
})

onUnmounted(() => {
    if (cursorInterval) clearInterval(cursorInterval)
})
</script>

<template>
    <div
        class="flex flex-col items-center justify-center min-h-screen text-gray-800 dark:text-white p-4 relative overflow-hidden">
        <div class="text-center z-10 space-y-6">
            <h1 class="text-4xl md:text-5xl font-bold relative">
                <span ref="greetingRef" class="inline-block"></span>
                <span class="inline-block w-0.5 h-8 bg-gray-800 dark:bg-white animate-blink ml-1"
                    :class="{ 'opacity-0': !showCursor }"></span>
            </h1>
            <div ref="contentRef" class="space-y-6 transition-opacity duration-1000"
                :class="{ 'opacity-0': !showContent, 'opacity-100': showContent }">
                <h2 class="text-3xl md:text-4xl font-bold">
                    <span class="text-teal-500 dark:text-teal-400">It's me </span>
                    <span ref="alternatingTextRef" class="text-yellow-500 dark:text-yellow-400"></span>
                </h2>
                <p class="text-xl md:text-2xl">{{ data.title }}</p>
                <p class="text-lg text-gray-600 dark:text-gray-400">{{ data.subtitle }}</p>
                <router-link v-if="contactSection" :to="'/' + contactSection.path"
                    class="inline-block px-8 py-3 font-bold text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 bg-gradient-to-bl from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 dark:from-primary-500 dark:to-primary-700 dark:hover:from-primary-600 dark:hover:to-primary-800">
                    Get in Touch
                </router-link>
            </div>
        </div>
    </div>
</template>