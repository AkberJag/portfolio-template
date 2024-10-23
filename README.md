# Portfolio Website Template

A fully customizable portfolio website template built using Vue.js, Tailwind CSS, PrimeVue 4, and Lucide Icons. Easily modify the layout, add or remove sections, and showcase your work in a modern, responsive format. This project is perfect for developers, designers, or anyone looking for a clean and customizable online portfolio.

## Demo

[Live Demo](https://www.akberjag.github.io)

## Features

- **Fully customizable**: Add, remove, or rearrange sections as needed using a JSON file.
- **PrimeVue UI components**: Integration of PrimeVue 4 for high-quality UI components.
- **Accent colors**: Support for Tailwind CSS predefined colors as accent colors.
- **Ripple effect**: Easily add ripple effects using the v-ripple directive for buttons and interactive elements.
- **Modern design**: Minimalistic, mobile-first design using Tailwind CSS.
- **Fast and lightweight**: Powered by Vue.js for a responsive and dynamic experience.
- **Icon support**: Lucide Icons for seamless icon integration.
- **Responsive layout**: Works on all screen sizes, from mobile to desktop.
- **Easy setup**: Simple installation and configuration process.

## How It Works

### Adding a Section Component (e.g., ContactSection.vue)

To add a new section, you need to create a corresponding Vue component (e.g., `ContactSection.vue`) and manage its data using the JSON configuration file. Here’s how to do it step-by-step:

1. **Create the Component:**

   Create a new Vue component in your `components` folder. For example, `ContactSection.vue`

2. **Define the Section in the JSON File:**
   Next, define the new section in your portfolio-data.json file. This is where you can manage the content of each section. For example, to add the ContactSection, you could define it as follows:

```json
{
  "sections": [
    {
      "name": "Home",
      "path": "home",
      "component": "HomeSection",
      "content": {
        "greeting": "Hey there!",
        "name": "John Doe",
        "secondaryName": "VU3CXF",
        "title": "Your Friendly Neighborhood Python Developer",
        "subtitle": "Ham Radio Enthusiast"
      }
    },
    {
      "name": "Contact",
      "path": "contact",
      "component": "ContactSection",
      "content": {
        "title": "Contact Me",
        "description": "Feel free to reach out to me via email or connect on social media!",
        "email": "your.email@example.com",
        "socialLinks": [
          {
            "name": "LinkedIn",
            "url": "https://linkedin.com/in/yourprofile",
            "icon": "M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"
          }
        ]
      }
    }
  ]
}
```

### Ripple Effect with v-ripple Directive

To add a ripple effect to buttons or other interactive elements, simply use the v-ripple directive:

```vue
<template>
  <button v-ripple class="btn-primary">Click Me</button>
</template>
```

### PrimeVue 4 Integration

This template uses PrimeVue 4 to offer a wide range of ready-to-use UI components. Example of using PrimeVue's Button component:

```vue
<template>
  <Button label="Click Me" v-ripple />
</template>
```

### Vue.js provide/inject Pattern

We leverage Vue's `provide/inject` pattern to make the section data accessible to child components without the need to pass props down multiple levels. This pattern is particularly useful for managing shared state across components.

For example, take a look at the `contactSection` variable in the `HomeSection.vue` component:

```js
const sections = inject("sections");
const contactSection = computed(() =>
  sections.find((section) => section.name === "Contact")
);
```

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/portfolio-template.git
   cd portfolio-template/frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

4. Build for production:

   ```bash
   npm run build
   ```

5. Deploy: After building, the production-ready files can be found in the `dist` folder. Deploy these to your preferred web hosting service.

### Deploying to GitHub Pages

For step-by-step instructions on deploying your Vue.js project to GitHub Pages, please refer to the official Vue.js documentation: [Vue CLI - Deployment to GitHub Pages.](https://cli.vuejs.org/guide/deployment.html#github-pages)

## Customization

### Adding/Removing Sections

To add or remove sections, edit the `portfolio.json` file located in the root of the project. Add a new section object or remove an existing one. Each section requires a name, path, component, and content.

### Localization (TODO)

The template currently supports English content. To extend this to other languages:

1. Implement a localization system (e.g., Vue I18n).
2. Store localized strings in JSON files or other formats.
3. Modify components to dynamically load the appropriate language based on user preferences or browser settings.

## Dependencies

- [Vue.js 3](https://vuejs.org/): A progressive JavaScript framework for building user interfaces.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
- [PrimeVue 4](https://primevue.org/): A comprehensive UI component library for Vue.js.
- [Lucide Icons](https://lucide.dev//): A flexible and customizable icon library.

## Contributing

Contributions are welcome! If you'd like to improve this template or add new features, feel free to open a pull request.

### How to contribute

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
