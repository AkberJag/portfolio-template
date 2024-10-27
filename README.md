# Portfolio Website Template

A fully customizable portfolio website template built using Vue.js, Tailwind CSS, and Lucide Icons. Easily modify the layout, add or remove sections, and showcase your work in a modern, responsive format. This project is perfect for developers, designers, or anyone looking for a clean and customizable online portfolio.

## Demo

[Live Demo](https://akberjag.github.io)

## Features

- **Fully customizable**: Add, remove, or rearrange sections as needed using a JSON file.
- **Accent colors**: Support for Tailwind CSS predefined colors as accent colors.
- **Modern design**: Minimalistic, mobile-first design using Tailwind CSS.
- **Fast and lightweight**: Powered by Vue.js for a responsive and dynamic experience.
- **Icon support**: Lucide Icons for seamless icon integration.
- **Responsive layout**: Works on all screen sizes, from mobile to desktop.
- **Easy setup**: Simple installation and configuration process.

## How It Works

### Adding a Section Component (e.g., ContactSection.vue)

To add a new section, you need to create a corresponding Vue component (e.g., `ContactSection.vue`) and manage its data using the JSON configuration file. Here's how to do it step-by-step:

1. **Create the Component:**

   Create a new Vue component in your `components` folder. For example, `ContactSection.vue`

2. **Define the Section in the JSON File:**
   Next, define the new section in your portfolio-data.json file. This is where you can manage the content of each section.

```json
{
  "sections": [
    {
      "name": "Home",
      "path": "home",
      "component": "HomeSection",
      "pageTitle": "John Doe | Web Developer & Designer"
    },
    {
      "name": "About",
      "path": "about",
      "component": "AboutSection",
      "pageTitle": "About Me | John Doe"
    },
    {
      "name": "Projects",
      "path": "projects",
      "component": "ProjectsSection",
      "pageTitle": "Projects | John Doe"
    },
    {
      "name": "Contact",
      "path": "contacts",
      "component": "ContactSection",
      "pageTitle": "Contact Me | John Doe"
    }
  ]
}
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

You have two options for deploying to GitHub Pages:

#### Option 1: Using the Deployment Script

1. Run the deployment script from the root of the project:

   ```bash
   ./deploy_gh_pages.sh
   ```

2. Configure GitHub Pages settings:
   - Go to your repository settings
   - Navigate to Pages section
   - Under "Build and deployment", select `gh-pages` branch
   - Click Save

#### Option 2: Manual Deployment

For step-by-step instructions on manually deploying your Vue.js project to GitHub Pages, please refer to the official Vue.js documentation: [Vue CLI - Deployment to GitHub Pages](https://cli.vuejs.org/guide/deployment.html#github-pages)

## Customization

### Adding/Removing Sections

To add or remove sections, edit the `portfolio.json` file located in the root of the project. Add a new section object or remove an existing one. Each section requires a name, path, component, and pageTitle.

### Localization (TODO)

The template currently supports English content. To extend this to other languages:

1. Implement a localization system (e.g., Vue I18n).
2. Store localized strings in JSON files or other formats.
3. Modify components to dynamically load the appropriate language based on user preferences or browser settings.

## Dependencies

- [Vue.js 3](https://vuejs.org/): A progressive JavaScript framework for building user interfaces.
- [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
- [Lucide Icons](https://lucide.dev/): A flexible and customizable icon library.

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
