<!-- todo: implement 'numScroll' -->

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
    items: {
        type: Array,
        required: true,
        default: () => []
    },
    responsiveOptions: {
        type: Array,
        default: () => [
            {
                breakpoint: '1024px',
                numVisible: 3
            },
            {
                breakpoint: '768px',
                numVisible: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1
            }
        ]
    },
    autoplay: {
        type: Boolean,
        default: false
    },
    interval: {
        type: Number,
        default: 5000
    },
    showControls: {
        type: Boolean,
        default: true
    }
});

// State
const currentIndex = ref(0);
const autoplayInterval = ref(null);
const isHovered = ref(false);
const itemsPerView = ref(1);

// Convert breakpoint string to number
const parseBreakpoint = (breakpoint) => {
    return parseInt(breakpoint.replace('px', ''));
};

// Sort responsive options by breakpoint in descending order
const sortedResponsiveOptions = computed(() => {
    return [...props.responsiveOptions].sort((a, b) =>
        parseBreakpoint(b.breakpoint) - parseBreakpoint(a.breakpoint)
    );
});

// Computed properties
const totalSlides = computed(() => {
    return Math.max(0, props.items.length - itemsPerView.value + 1);
});

const isItemVisible = (index) => {
    return index >= currentIndex.value && index < currentIndex.value + itemsPerView.value;
};

// Updated navigation methods for circular navigation
const nextSlide = () => {
    if (currentIndex.value >= totalSlides.value - 1) {
        // If at the end, go back to the beginning
        currentIndex.value = 0;
    } else {
        currentIndex.value++;
    }
};

const prevSlide = () => {
    if (currentIndex.value <= 0) {
        // If at the beginning, go to the end
        currentIndex.value = totalSlides.value - 1;
    } else {
        currentIndex.value--;
    }
};

const goToSlide = (index) => {
    currentIndex.value = Math.min(Math.max(0, index), totalSlides.value - 1);
};

// Auto-play functionality with circular navigation
const startAutoplay = () => {
    if (props.autoplay && !autoplayInterval.value && !isHovered.value) {
        autoplayInterval.value = setInterval(() => {
            nextSlide(); // Use the updated nextSlide method
        }, props.interval);
    }
};

const stopAutoplay = () => {
    if (autoplayInterval.value) {
        clearInterval(autoplayInterval.value);
        autoplayInterval.value = null;
    }
};

const handleKeydown = (event) => {
    if (event.key === 'ArrowLeft') {
        prevSlide();
    } else if (event.key === 'ArrowRight') {
        nextSlide();
    }
};

// Resize handler with debounce
let resizeTimeout;
const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateResponsiveOptions();
    }, 200);
};

const updateResponsiveOptions = () => {
    const width = window.innerWidth;
    let matched = false;

    for (const option of sortedResponsiveOptions.value) {
        if (width > parseBreakpoint(option.breakpoint)) {
            itemsPerView.value = option.numVisible;
            matched = true;
            break;
        }
    }

    if (!matched && sortedResponsiveOptions.value.length > 0) {
        const smallestOption = sortedResponsiveOptions.value[sortedResponsiveOptions.value.length - 1];
        itemsPerView.value = smallestOption.numVisible;
    }

    // Ensure current index is valid
    if (currentIndex.value >= totalSlides.value) {
        currentIndex.value = Math.max(0, totalSlides.value - 1);
    }
};

// Lifecycle
onMounted(() => {
    updateResponsiveOptions();
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeydown);
    startAutoplay();
});

onUnmounted(() => {
    stopAutoplay();
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('keydown', handleKeydown);
    clearTimeout(resizeTimeout);
});

// Watch for props changes
watch(() => props.autoplay, (newValue) => {
    if (newValue) {
        startAutoplay();
    } else {
        stopAutoplay();
    }
});

watch([itemsPerView, () => props.items], () => {
    if (currentIndex.value >= totalSlides.value) {
        currentIndex.value = Math.max(0, totalSlides.value - 1);
    }
}, { deep: true });
</script>

<template>
    <div class="relative w-full py-8">
        <div class="w-full overflow-hidden">
            <div class="flex transition-transform duration-300 ease-in-out"
                :style="{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }">
                <!-- Individual slides -->
                <div v-for="(item, index) in items" :key="index" class="flex-shrink-0 px-2 transition-all duration-300"
                    :style="{ width: `${100 / itemsPerView}%` }">
                    <slot name="item" :data="item" :isActive="isItemVisible(index)">
                        <!-- Default template -->
                        <div
                            class="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl">
                            <div class="p-4 h-full flex flex-col">
                                <h3 class="text-lg font-semibold text-primary-900 dark:text-primary-100">
                                    {{ item.title }}
                                </h3>
                                <p class="mt-2 text-primary-600 dark:text-primary-300">
                                    {{ item.description }}
                                </p>
                            </div>
                        </div>
                    </slot>
                </div>
            </div>
        </div>

        <!-- Navigation buttons -->
        <div class="absolute inset-y-0 left-0 right-0 flex items-center justify-between pointer-events-none">
            <button @click="prevSlide"
                class="group pointer-events-auto flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:bg-gray-800/80 dark:hover:bg-primary-900 -ml-4 transition-all duration-200"
                :class="{ 'opacity-0': !showControls }" aria-label="Previous slide">
                <ChevronLeft
                    class="h-5 w-5 text-primary-600 transition-transform group-hover:-translate-x-0.5 dark:text-primary-300" />
            </button>

            <button @click="nextSlide"
                class="group pointer-events-auto flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-primary-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 dark:bg-gray-800/80 dark:hover:bg-primary-900 -mr-4 transition-all duration-200"
                :class="{ 'opacity-0': !showControls }" aria-label="Next slide">
                <ChevronRight
                    class="h-5 w-5 text-primary-600 transition-transform group-hover:translate-x-0.5 dark:text-primary-300" />
            </button>
        </div>

        <!-- Pagination dots -->
        <div class="absolute bottom-0 left-0 right-0">
            <div class="flex justify-center gap-2">
                <button v-for="index in totalSlides" :key="index" @click="goToSlide(index - 1)"
                    class="w-2 h-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400"
                    :class="[
                        currentIndex === index - 1
                            ? 'bg-primary-800 scale-125 dark:bg-primary-200'
                            : 'bg-primary-300 hover:bg-primary-400 dark:bg-primary-600 dark:hover:bg-primary-500'
                    ]" :aria-label="`Go to slide ${index}`"
                    :aria-current="currentIndex === index - 1 ? 'true' : 'false'"></button>
            </div>
        </div>
    </div>
</template>