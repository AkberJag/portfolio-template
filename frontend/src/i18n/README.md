# Dynamic i18n Translation System 🌍

A smart translation system that automatically loads missing translations on demand while maintaining clean code splitting.

## Getting Started

### Project Structure

```
src/
├─ i18n/
│  ├─ index.js       # Main i18n configuration
│  ├─ languages.json # Supported languages
│  └─ locales/       # Base translations
│     ├─ en.json
│     └─ fr.json
features/
├─ {feature}/
│  └─ locales/       # Feature-specific translations
│     ├─ en.json
│     └─ fr.json
```

## Usage in Components

1. **Basic Translation**  
   Use the `useFeatureTranslations` hook in your Vue component:

```vue
<script setup>
import { useFeatureTranslations } from '@/composables/useVueI18n'

// Initialize for your feature
const { t, isLoading } = useFeatureTranslations('auth')
</script>

<template>
  <!-- Use dot notation for nested keys -->
  <h1>{{ t('login.title') }}</h1>

  <!-- Show loading state if needed -->
  <p v-if="isLoading">Loading translations...</p>
</template>
```

2. **Translation Files**  
   Create JSON files for each language in your feature's `locales` folder:

`features/auth/locales/en.json`

```json
{
  "login": {
    "title": "Welcome Back",
    "button": "Sign In"
  },
  "logout": "Log Out"
}
```

## Key Features

### 🚀 Automatic Loading

- Missing translations trigger automatic loading
- Loads only needed language files
- Shows console warnings for missing keys in development

### 🔄 Smart Reloading

Force fresh translations when needed:

```javascript
const { t, reload } = useFeatureTranslations('auth')

async function refreshTranslations() {
  await reload()
  // Translations are now updated
}
```

### 📦 Loading States

Track translation loading status:

```vue
<template>
  <button :disabled="isLoading">
    {{ isLoading ? 'Loading...' : t('submit') }}
  </button>
</template>
```

## Best Practices

1. **File Organization**

   - Keep base translations in `/i18n/locales`
   - Feature-specific translations in their own `/locales` folder
   - Name files using language codes (`en.json`, `fr.json`)

2. **Key Naming**

   ```json
   // Good
   "dashboard": {
     "welcome": "Hello!"
   }

   // Avoid
   "dashboardWelcome": "Hello!"
   ```

3. **Error Handling**
   - Missing keys show console warnings
   - Failed loads automatically retry on next access
   - Use network tab to inspect translation loading

## Troubleshooting

**Missing Translations?**

1. Check console for loading errors
2. Verify file exists in correct location
3. Confirm JSON structure matches key path
4. Check language code matches (en vs en-US)

[!NOTE]  
This system automatically combines base translations with feature-specific ones,
prioritizing feature translations when keys overlap. 🪄
