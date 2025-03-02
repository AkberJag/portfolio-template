<script setup>
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
</script>

<template>
  <div>

    <!-- common -->
    <h1>{{ t('sections.home.greeting') }}</h1>

    <!-- feature specific -->
    <button>{{ t('example.hello') }}</button>
  </div>
</template>
