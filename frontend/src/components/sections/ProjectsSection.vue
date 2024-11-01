<script setup>
import { ref } from 'vue';
import Carousel from '../TheCarousel.vue';


const data = [
    {
        "title": "Project 1",
        "description": "A Vue.js web application for task management.",
        "link": "#",
        "technologies": ["Vue.js", "Vuex", "Tailwind CSS", "Firebase"]
    },
    {
        "title": "Project 2",
        "description": "An e-commerce platform built with Vue and Node.js.",
        "link": "#",
        "technologies": ["Vue.js", "Node.js", "Express", "MongoDB"]
    },
    {
        "title": "Project 3",
        "description": "A responsive portfolio website using Vue and Tailwind CSS.",
        "link": "#",
        "technologies": ["Vue.js", "Tailwind CSS", "Vite"]
    },
    {
        "title": "Project 4",
        "description": "A real-time chat application with Vue and Firebase.",
        "link": "#",
        "technologies": ["Vue.js", "Firebase", "Vuex", "Vue Router"]
    },
    {
        "title": "Project 5",
        "description": "Another real-time chat application with Vue and Firebase.",
        "link": "#",
        "technologies": ["Vue.js", "Firebase", "Vuex", "Vue Router"]
    }
]

const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 1
    },
    {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 1
    },
    {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
    }
]);
</script>

<template>
    <div class="min-w-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-xl sm:text-2xl font-bold dark:text-white text-gray-900 mb-4 sm:mb-6 text-center">My
            Projects</h2>

        <!-- Mobile Carousel: One item visible -->
        <Carousel v-if="data.length > 2" :items="data" :numVisible="1" :numScroll="1" circular
            :responsiveOptions="responsiveOptions" class="pb-6 sm:hidden">
            <template #item="slotProps">
                <div class="p-1 h-full">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-3 h-full flex flex-col">
                        <h3 class="text-base font-semibold mb-2 text-gray-900 dark:text-white">
                            {{ slotProps.data.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 text-xs mb-3 flex-grow">
                            {{ slotProps.data.description }}
                        </p>
                        <div class="mt-auto">
                            <div class="flex flex-wrap gap-1 mb-2">
                                <span v-for="tech in slotProps.data.technologies.slice(0, 4)" :key="tech"
                                    class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    {{ tech }}
                                </span>
                            </div>
                            <a :href="slotProps.data.link" target="_blank" rel="noopener noreferrer"
                                class="text-blue-500 hover:underline text-xs inline-block">
                                View Project
                            </a>
                        </div>
                    </div>
                </div>
            </template>
        </Carousel>

        <!-- Tablet Carousel: Two items visible -->
        <Carousel v-if="data.length > 2" :items="data" :numVisible="2" :numScroll="1" circular
            :responsiveOptions="responsiveOptions" class="pb-6 hidden sm:block lg:hidden">
            <template #item="slotProps">
                <div class="p-2 h-full">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full flex flex-col">
                        <h3 class="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                            {{ slotProps.data.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                            {{ slotProps.data.description }}
                        </p>
                        <div class="mt-auto">
                            <div class="flex flex-wrap gap-1 mb-3">
                                <span v-for="tech in slotProps.data.technologies.slice(0, 4)" :key="tech"
                                    class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    {{ tech }}
                                </span>
                            </div>
                            <a :href="slotProps.data.link" target="_blank" rel="noopener noreferrer"
                                class="text-blue-500 hover:underline text-sm inline-block">
                                View Project
                            </a>
                        </div>
                    </div>
                </div>
            </template>
        </Carousel>

        <!-- Desktop Carousel: Three items visible -->
        <Carousel v-if="data.length > 2" :items="data" :numVisible="3" :numScroll="1" circular
            :responsiveOptions="responsiveOptions" class="pb-6 hidden lg:block">
            <template #item="slotProps">
                <div class="p-2 h-full">
                    <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 h-full flex flex-col">
                        <h3 class="text-lg md:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                            {{ slotProps.data.title }}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 text-sm md:text-base mb-4 flex-grow">
                            {{ slotProps.data.description }}
                        </p>
                        <div class="mt-auto">
                            <div class="flex flex-wrap gap-1 mb-3">
                                <span v-for="tech in slotProps.data.technologies.slice(0, 4)" :key="tech"
                                    class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                                    {{ tech }}
                                </span>
                            </div>
                            <a :href="slotProps.data.link" target="_blank" rel="noopener noreferrer"
                                class="text-blue-500 hover:underline text-sm md:text-base inline-block">
                                View Project
                            </a>
                        </div>
                    </div>
                </div>
            </template>
        </Carousel>

        <!-- Grid view for when less than 2 projects -->
        <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div v-for="project in data" :key="project.title"
                class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col h-full">
                <h3 class="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {{ project.title }}
                </h3>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">{{ project.description }}</p>
                <div class="mt-auto">
                    <div class="flex flex-wrap gap-1 mb-3">
                        <span v-for="tech in project.technologies.slice(0, 4)" :key="tech"
                            class="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                            {{ tech }}
                        </span>
                    </div>
                    <a :href="project.link" target="_blank" rel="noopener noreferrer"
                        class="text-blue-500 hover:underline text-xs sm:text-sm">
                        View Project
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>