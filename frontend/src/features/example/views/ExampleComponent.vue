<script setup>
import LanguageSwitcher from '@/components/LanguageSwitcher.vue';
import { useFeatureTranslations } from '@/composables/useI18n';
import { useI18n } from 'vue-i18n';
import TestComponent from '../components/TestComponent.vue';


const { t } = useI18n()
const { t: authT } = useFeatureTranslations('example')
</script>

<template>
  <div>
    <LanguageSwitcher />

    <!-- common -->
    <h1>{{ t('sections.home.greeting') }}</h1>

    <!-- feature specific -->
    <button>{{ t('example.hello') }}</button>

    <h4 class="underline mt-10">Example component</h4>

    <TestComponent />
  </div>
</template>
