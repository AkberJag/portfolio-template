<script setup>
import { ref, onMounted } from 'vue';

const props = defineProps({
    starCount: {
        type: Number,
        default: 100
    }
});

const starColors = [
    'text-yellow-300 dark:text-yellow-200',
    'text-orange-300 dark:text-orange-200',
    'text-pink-300 dark:text-pink-200',
    'text-purple-300 dark:text-purple-200'
];
const starShapes = ['•', '✦', '✧', '+', '×', '★', '✸'];

const stars = ref([]);

const generateStars = () => {
    stars.value = Array.from({ length: props.starCount }, (_, index) => ({
        id: index,
        color: starColors[Math.floor(Math.random() * starColors.length)],
        shape: starShapes[Math.floor(Math.random() * starShapes.length)],
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: 2 + Math.random() * 3
    }));
};

onMounted(() => {
    generateStars();
});
</script>

<template>
    <div class="absolute inset-0 overflow-hidden opacity-50 pointer-events-none">
        <div v-for="star in stars" :key="star.id" class="absolute text-xs md:text-sm" :class="star.color"
            :style="{ left: star.left, top: star.top, animation: `twinkle ${star.duration}s infinite` }">
            {{ star.shape }}
        </div>
    </div>
</template>

<style>
@keyframes twinkle {

    0%,
    100% {
        opacity: 0;
    }

    50% {
        opacity: 1;
    }
}
</style>