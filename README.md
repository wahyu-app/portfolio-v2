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
- Responsive WebP images with preserved source assets

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
  image: "assets/images/projects/optimized/project-image-1600.webp",
  imageSrcset: [
    "assets/images/projects/optimized/project-image-640.webp 640w",
    "assets/images/projects/optimized/project-image-960.webp 960w",
    "assets/images/projects/optimized/project-image-1600.webp 1600w",
  ].join(", "),
  imageAlt: "Accessible description of the project preview",
  url: "https://example.com",
  year: 2026,
}
```

Store project screenshots in `assets/images/projects/` and use a 16:9 desktop screenshot for each project image. Leave `url` empty while a project link is unavailable. The project count and year range are generated automatically.

Keep the original screenshots as source assets and create WebP variants in `assets/images/projects/optimized/` at 640×360, 960×540, and 1600×900. Preserve the top of the screenshot when cropping to 16:9 and compare the result to the source to keep small text sharp. Start with WebP quality 90 and increase it if needed. Use a local image encoder to generate these files; the website itself has no image-processing dependency or build step.

`image` is the fallback URL. The optional `imageSrcset` string lists available widths; when supplied, the renderer adds `srcset` and a `sizes` value matching the project grid and its image frame. Projects that only provide `image` continue to work. Keep `PROJECT_IMAGE_SIZES` in sync if the grid spacing or breakpoints change.

The portrait source remains at `assets/images/portrait.webp`. Its responsive WebP variants live in `assets/images/optimized/` at widths of 432, 648, and 864 pixels, preserving the source aspect ratio. Start with quality 85 and compare the result before publishing. The hero uses eager loading and high fetch priority; project screenshots remain lazy-loaded. All existing reveal animations are preserved.

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
│   ├── icons/
│   │   └── favicon-hi-res.png
│   └── images/
│       ├── portrait.webp
│       ├── optimized/
│       └── projects/
│           └── optimized/
├── app.js
├── index.html
├── styles.css
└── README.md
```

## Customization

- Edit page content and section markup in `index.html`.
- Update colors, spacing, breakpoints, and component styles in `styles.css`.
- Update projects, external links, theme behavior, navigation state, and motion in `app.js`.
- Replace fonts in `assets/fonts/`, icons in `assets/icons/`, and images in `assets/images/` while keeping their referenced paths in sync.

## Browser Support

The site targets current versions of Chrome, Edge, Firefox, and Safari. JavaScript enhancements use progressive fallbacks where appropriate, and motion is disabled when the user enables reduced-motion preferences.
