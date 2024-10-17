<script setup>
import { Palette } from "lucide-vue-next";
import { ref, onBeforeMount } from "vue";

import ThemeSwitcher from "./ThemeSwitcher.vue";
import AccentColorPicker from "./AccentColorPicker.vue";

import { useThemeStore } from '@/stores/themeStore';
import { useColorStore } from '@/stores/colorStore';

const themeStore = useThemeStore()
const colorStore = useColorStore()

const op = ref();

const toggle = (event) => {
    op.value.toggle(event);
};

onBeforeMount(() => {
    themeStore.applyTheme()
    colorStore.initializeColor()
});
</script>

<template>
    <button @click="toggle"
        class="fixed top-4 right-4 z-50 p-2 border-none rounded-full shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-40 bg-white text-primary-500 dark:bg-gray-900">
        <Palette class="size-5" />
    </button>
    <Popover ref="op"
        class="rounded-lg shadow-xl bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-opacity-20 border-white dark:bg-gray-800 dark:bg-opacity-20 dark:border-gray-700">
        <div class="w-[20rem] space-y-4">
            <ThemeSwitcher />
            <AccentColorPicker />
        </div>
    </Popover>
</template>
