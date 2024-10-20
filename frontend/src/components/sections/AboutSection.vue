<script setup>
import { defineProps } from 'vue';

const props = defineProps({
    data: {
        type: Object,
        required: true
    }
});
</script>
<template>
    <div class="max-w-2xl text-center px-4">
        <h2 class="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-6">{{ data.title }}</h2>
        <p class="text-sm md:text-lg text-white">
            {{ data.description }}
        </p>
    </div>
</template>