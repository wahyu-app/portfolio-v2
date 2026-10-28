# Portfolio

A responsive personal portfolio for a front-end developer. The site presents skills, background, featured work, services, and contact options in a focused single-page experience.

## Features

- Responsive layouts for desktop, tablet, and mobile
- Sticky navigation with active-section tracking
- Dark theme by default with a persistent light/dark toggle
- Data-driven project cards for easy Work section updates
- Scroll progress indicator and replayable reveal animations
- Reduced-motion support for accessibility
- Theme-aware browser and mobile status bar colors
- Custom favicon and iOS home screen icon
- Semantic HTML and keyboard-accessible navigation

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Local variable fonts

The project has no framework, package manager, or build step.

## Getting Started

Clone or download the repository, then run a local static server from the project directory:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in a browser.

## Updating the Work Section

Project cards are generated from `WORK_PROJECTS` at the top of `app.js`. Add, remove, or reorder project objects to update the section.

```js
{
  title: "Project title",
  description: "A short project description.",
  technologies: ["HTML", "CSS", "JS"],
  image: "assets/project-image.png",
  imageAlt: "Accessible description of the project preview",
  url: "https://example.com",
  year: 2026,
}
```

Use a 16:9 desktop screenshot for each project image. Leave `url` empty while a project link is unavailable. The project count and year range are generated automatically.

## Configuring Contact and Social Links

Update `SITE_LINKS` near the top of `app.js`:

```js
const SITE_LINKS = Object.freeze({
  email: "mailto:you@example.com",
  whatsapp: "https://wa.me/<number>",
  github: "https://github.com/<username>",
  linkedin: "https://www.linkedin.com/in/<username>",
});
```

Empty values remain disabled and show a placeholder notice when selected.

## Project Structure

```text
portfolio-v2/
├── assets/
│   ├── fonts/
│   ├── portrait.webp
│   ├── projects-*.png
│   └── favicon and home screen icons
├── app.js
├── index.html
├── styles.css
└── README.md
```

## Customization

- Edit page content and section markup in `index.html`.
- Update colors, spacing, breakpoints, and component styles in `styles.css`.
- Update projects, external links, theme behavior, navigation state, and motion in `app.js`.
- Replace images and fonts in `assets/` while keeping their referenced filenames in sync.

## Browser Support

The site targets current versions of Chrome, Edge, Firefox, and Safari. JavaScript enhancements use progressive fallbacks where appropriate, and motion is disabled when the user enables reduced-motion preferences.
