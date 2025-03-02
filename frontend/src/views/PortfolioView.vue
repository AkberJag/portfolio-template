<script setup>
import { provide, ref, defineAsyncComponent, onMounted, onBeforeUnmount, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import SettingsButton from '@/components/SettingsButton.vue';
import StarryBackground from '@/components/StarryBackground.vue';
import portfolioData from '@/portfolio-data.json';
import NavigationDots from '@/components/NavigationDots.vue';

const { t } = useI18n();

// Initialize Vue Router and Route
const router = useRouter();
const route = useRoute(); // Add this to access route params

// State for controlling scrollbar visibility
const showScrollbar = ref(false);
provide('showScrollbar', showScrollbar); // Provide scrollbar state to child components

// Portfolio sections data
const sections = portfolioData.sections;
provide('sections', sections); // Provide sections data to child components

// Track the currently active section
const activeSection = ref(0);

// Template ref for the scroll container
const container = ref(null);

// Flag to prevent Intersection Observer from changing the section during initial load
const initialLoadComplete = ref(false);

// Reference to the Intersection Observer
let observer = null;

// Updates the URL to reflect the current section without adding to browser history.
const updateUrl = (index) => {
  const section = sections[index];
  if (section) {
    // Preserve the language parameter when updating the URL
    const lang = route.params.lang || 'en';
    router.replace({ path: `/${lang}/${section.path}` });
  }
};

// Updates the document title based on the active section.
const updateTitle = (index) => {
  const section = sections[index];
  if (section && section.translationKey) {
    const pageTitleKey = `${section.translationKey}.pageTitle`;
    document.title = t(pageTitleKey);
  }
};

/**
 * Scrolls to a specific section by its index.
 * @param {number} index - The index of the section to navigate to.
 * @param {boolean} [smooth=true] - Whether to use smooth scrolling or instant jump
 */
const navigateToSection = (index, smooth = true) => {
  // Ensure container is available
  if (!container.value) {
    console.warn('Container not available for navigation');
    return;
  }

  const sectionElements = container.value.querySelectorAll('.snap-start');

  if (!sectionElements || sectionElements.length === 0) {
    console.warn('No section elements found for navigation');
    return;
  }

  if (sectionElements[index]) {
    // Scroll to the section with optional smooth behavior
    sectionElements[index].scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });

    // Update the URL to reflect the current section
    updateUrl(index);

    // Update active section state
    activeSection.value = index;

    // Update the document title
    if (sections[index]) {
      updateTitle(index);
    }
  } else {
    console.warn(`Section at index ${index} not found`);
  }
};

// Watch for section parameter changes in the URL
watch(
  () => route.params.section,
  (newSection) => {
    if (initialLoadComplete.value && newSection) {
      const sectionIndex = sections.findIndex((section) => section.path === newSection);

      if (sectionIndex !== -1 && sectionIndex !== activeSection.value) {
        navigateToSection(sectionIndex);
      }
    }
  }
);

// Dynamically import section components based on the portfolio data
const sectionComponents = Object.fromEntries(
  sections.map((section) => [
    section.component,
    defineAsyncComponent(() =>
      import(`@/components/sections/${section.component}.vue`)
    ),
  ])
);

// Setup Intersection Observer to track active sections
onMounted(() => {
  // Use a longer delay to ensure all dynamic components are properly loaded and rendered
  setTimeout(() => {
    const sectionElements = container.value.querySelectorAll('.snap-start');

    if (!sectionElements || sectionElements.length === 0) {
      console.warn('No section elements found. Components may not be fully rendered yet.');
      return;
    }

    // Check the current URL section parameter on page load
    const initialSection = route.params.section;
    const initialSectionIndex = initialSection
      ? sections.findIndex((section) => section.path === initialSection)
      : 0; // Default to first section if no section is specified

    // Initialize section based on URL or default to first section
    if (initialSectionIndex !== -1) {
      // For direct URL navigation, use native scrollIntoView for more reliable scrolling
      const targetElement = sectionElements[initialSectionIndex];
      if (targetElement) {
        // First update the active section
        activeSection.value = initialSectionIndex;

        // Update the document title
        if (sections[initialSectionIndex]) {
          updateTitle(initialSectionIndex);
        }

        // Force scroll to element
        targetElement.scrollIntoView({ behavior: 'auto' });
      } else {
        navigateToSection(0);
      }
    } else {
      // Default to the first section if no path match is found
      navigateToSection(0);
    }

    // Mark initial load as complete after navigation
    setTimeout(() => {
      initialLoadComplete.value = true;
    }, 200); // Longer delay to ensure scrolling has completed

    // Create an Intersection Observer to detect when sections become active
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && initialLoadComplete.value) {
            const index = Array.from(sectionElements).indexOf(entry.target);
            if (activeSection.value !== index) {
              activeSection.value = index; // Update the active section
              updateUrl(index); // Update the URL to reflect the active section

              // Update the document title when section changes
              if (sections[index]) {
                updateTitle(index);
              }
            }
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the section is visible
        root: container.value, // Use the container as the root for the observer
      }
    );

    // Observe each section element
    sectionElements.forEach((el) => observer.observe(el));
  });
});

// Cleanup the observer when the component is unmounted
onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect();
  }
});
</script>


<template>
  <!-- Scroll container with snap behavior -->
  <div ref="container"
    class="w-full h-screen overflow-y-scroll snap-y snap-mandatory bg-slate-100 dark:bg-gray-900 transition-colors duration-700"
    :class="showScrollbar ? 'scrollbar-visible' : 'scrollbar-hidden'">
    <!-- Starry background component -->
    <StarryBackground />

    <!-- Render each section dynamically -->
    <div v-for="(section, index) in sections" :key="index" class="w-full h-screen flex flex-col snap-start"
      :id="section.path">
      <div class="flex-grow overflow-y-auto">
        <!-- Dynamically load the section component -->
        <component :is="sectionComponents[section.component]" :section="section" />
      </div>
    </div>

    <!-- Navigation dots for section navigation -->
    <NavigationDots :sections="sections" :activeSection="activeSection" @navigate="navigateToSection"
      class="fixed right-4 top-1/2 -translate-y-1/2 z-20" />

    <!-- Settings button -->
    <SettingsButton class="z-20" />
  </div>
</template>
