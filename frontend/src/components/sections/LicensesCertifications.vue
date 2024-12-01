<script setup>
import { ref, computed } from 'vue'
import awsCFLImage from '@/assets/images/aws-certified-cloud-practitioner.png'
import awsDAImage from '@/assets/images/aws-certified-associate.png'
import radioImage from '@/assets/images/radio.png'

import Carousel from '../TheCarousel.vue'

const featuredCertifications = ref([
    {
        title: "AWS Cloud Practitioner",
        image: awsCFLImage,
        alt: "AWS Cloud Practitioner Certification Badge",
        details: "Validates overall understanding of the AWS Cloud",
        verifyLink: "https://aws.amazon.com/verification",
        featured: true
    },
    {
        title: "AWS Certified Developer - Associate",
        image: awsDAImage,
        alt: "Google Cloud Architect Certification Badge",
        details: "Design, develop, and manage robust, secure, scalable, highly available, and dynamic solutions to drive business objectives",
        verifyLink: "https://cloud.google.com/certification/cloud-architect",
        featured: true
    },
    {
        title: "Amateur Wireless Station license",
        image: radioImage,
        alt: "Azure Solutions Architect Certification Badge",
        details: "Expertise in compute, network, storage, and security to design solutions that run on Azure",
        featured: true
    }
])

const otherCertifications = ref([
    {
        title: "React Developer",
        image: "/react-certification.png",
        alt: "React Developer Certification",
        featured: false
    },
    {
        title: "Vue.js Developer",
        image: "/vue-certification.png",
        alt: "Vue.js Developer Certification",
        featured: false
    },
    {
        title: "TypeScript",
        image: "/typescript-certification.png",
        alt: "TypeScript Certification",
        featured: false
    },
    {
        title: "Node.js",
        image: "/nodejs-certification.png",
        alt: "Node.js Developer Certification",
        featured: false
    },
    {
        title: "MongoDB",
        image: "/mongodb-certification.png",
        alt: "MongoDB Certification",
        featured: false
    },
    {
        title: "Docker",
        image: "/docker-certification.png",
        alt: "Docker Certification",
        featured: false
    },
])

const responsiveOptions = ref([
    {
        breakpoint: '1024px',
        numVisible: 5
    },
    {
        breakpoint: '768px',
        numVisible: 2
    },
    {
        breakpoint: '560px',
        numVisible: 1
    }
]);

const allCertifications = computed(() => [...featuredCertifications.value, ...otherCertifications.value])

const hasOtherCertifications = computed(() => otherCertifications.value.length > 0)

const gridColumns = computed(() => {
    const count = otherCertifications.value.length
    if (count >= 6) return 6
    if (count >= 3) return count
    if (count === 2) return 2
    return 1
})

const gridColumnsFeatured = computed(() => {
    const count = featuredCertifications.value.length
    return count === 1 ? 1 : count === 2 ? 2 : 3
})

const maxWidthFeatured = computed(() => {
    const count = featuredCertifications.value.length
    return count === 1 ? 'max-w-xl' : count === 2 ? 'max-w-3xl' : 'max-w-6xl'
})

const featuredItemClass = computed(() => {
    const count = featuredCertifications.value.length
    return count === 1 ? 'max-w-[320px] mx-auto w-full' : 'w-full'
})

</script>

<template>
    <section class="min-w-0 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 text-center">
            Licenses and Certifications
        </h2>

        <!-- Mobile and Tablet: Single Carousel -->
        <div class="lg:hidden">
            <Carousel :items="allCertifications" :numVisible="1" :numScroll="1" circular>
                <template #item="{ data }">
                    <div class="p-2 aspect-square w-full max-w-[300px] mx-auto">
                        <!-- Featured Certification Style -->
                        <div v-if="data.featured" class="relative group h-full">
                            <div
                                class="h-full p-4 flex items-center justify-center rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80">
                                <img :src="data.image" :alt="data.alt" class="w-4/5 h-4/5 object-contain rounded-lg"
                                    loading="lazy" />
                            </div>
                            <div
                                class="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                <h3 class="text-white text-lg font-semibold mb-2 text-center">{{ data.title }}</h3>
                                <p class="text-white text-sm text-center mb-3">{{ data.details }}</p>
                                <a v-if="data.verifyLink" :href="data.verifyLink" target="_blank"
                                    rel="noopener noreferrer"
                                    class="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold 
                                         transition-all duration-300 hover:shadow-xl ease-in-out transform hover:-translate-y-1 
                                         bg-gradient-to-bl from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700">
                                    Verify Certification
                                </a>
                            </div>
                        </div>
                        <!-- Other Certification Style -->
                        <div v-else
                            class="h-full flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg p-4">
                            <img :src="data.image" :alt="data.alt" class="w-4/5 h-4/5 object-contain rounded-lg"
                                loading="lazy" />
                        </div>
                    </div>
                </template>
            </Carousel>
        </div>

        <!-- Desktop: Grid Layout -->
        <div class="hidden lg:block">
            <!-- Featured Certifications Grid -->
            <div :class="[
                'grid gap-6 mb-12 mx-auto',
                `grid-cols-${gridColumnsFeatured}`,
                maxWidthFeatured
            ]">
                <div v-for="cert in featuredCertifications" :key="cert.title" class="relative group aspect-square"
                    :class="featuredItemClass">
                    <div
                        class="h-full p-6 flex items-center justify-center rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-80">
                        <img :src="cert.image" :alt="cert.alt" class="w-4/5 h-4/5 object-contain rounded-lg"
                            loading="lazy" />
                    </div>
                    <div
                        class="absolute inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                        <h3 class="text-white text-xl font-semibold mb-2 text-center">{{ cert.title }}</h3>
                        <p class="text-white text-base text-center mb-4">{{ cert.details }}</p>
                        <a v-if="cert.verifyLink" :href="cert.verifyLink" target="_blank" rel="noopener noreferrer"
                            class="bg-white text-black px-4 py-2 rounded-full text-sm font-semibold 
                                 transition-all duration-300 hover:shadow-xl ease-in-out transform hover:-translate-y-1 
                                 bg-gradient-to-bl from-primary-400 to-primary-600 hover:from-primary-500 hover:to-primary-700">
                            Verify Certification
                        </a>
                    </div>
                </div>
            </div>

            <!-- Other Certifications Section-->
            <div v-if="hasOtherCertifications" class="max-w-4xl mx-auto">
                <!-- Grid Layout for 6 or fewer items -->
                <div v-if="otherCertifications.length <= 6" class="grid gap-4" :class="{
                    'grid-cols-1 max-w-[160px] mx-auto': otherCertifications.length === 1,
                    'grid-cols-2 max-w-[400px] mx-auto': otherCertifications.length === 2,
                    [`grid-cols-${gridColumns}`]: otherCertifications.length > 2
                }">
                    <div v-for="cert in otherCertifications" :key="cert.title"
                        class="aspect-square w-full p-2 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg max-w-[160px] mx-auto">
                        <img :src="cert.image" :alt="cert.alt" class="w-4/5 h-4/5 object-contain rounded-lg"
                            loading="lazy" />
                    </div>
                </div>

                <!-- Carousel for more than 6 items -->
                <Carousel v-else :items="otherCertifications" :responsiveOptions="responsiveOptions" circular
                    class="max-w-full">
                    <template #item="{ data }">
                        <div class="p-2">
                            <div
                                class="aspect-square w-full p-2 flex items-center justify-center bg-white dark:bg-gray-800 rounded-lg max-w-[160px] mx-auto">
                                <img :src="data.image" :alt="data.alt" class="w-4/5 h-4/5 object-contain rounded-lg"
                                    loading="lazy" />
                            </div>
                        </div>
                    </template>
                </Carousel>
            </div>
        </div>
    </section>
</template>