<script setup>
import { Mail } from 'lucide-vue-next';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});

const openEmailClient = () => {
    if (props.data.email) {
        window.location.href = `mailto:${props.data.email}`;
    }
};
</script>

<template>
    <div class="w-full max-w-md px-4 text-center">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">{{ data.title }}</h2>
        <p class="text-white mb-6">{{ data.description }}</p>
        <button v-if="data.email" @click="openEmailClient"
            class="bg-primary text-white hover:bg-primary-400 font-semibold py-2 px-4 rounded-md transition duration-300 text-sm md:text-base flex items-center justify-center mx-auto mb-6 shadow-lg hover:shadow-xl ease-in-out transform hover:-translate-y-1 bg-gradient-to-bl from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700 dark:from-primary-500 dark:to-primary-700 dark:hover:from-primary-600 dark:hover:to-primary-800">
            <Mail class="size-5 mr-2" />
            Send me an email
        </button>
        <div class="flex justify-center space-x-4">
            <a v-for="link in data.socialLinks" :key="link.name" :href="link.url" target="_blank"
                rel="noopener noreferrer" class="text-white hover:text-primary-300 transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                    <path :d="link.icon" />
                </svg>
                <span class="sr-only">{{ link.name }}</span>
            </a>
        </div>
    </div>
</template>