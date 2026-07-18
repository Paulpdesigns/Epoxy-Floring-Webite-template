# Slabworks — Commercial Epoxy & Polished Concrete Website Template

A fully coded, static, animation-driven website template for epoxy flooring / polished
concrete / commercial concrete contractors. Built with plain HTML, CSS and vanilla
JavaScript — no build step, no framework, no dependencies to install. Ready to push
straight to GitHub Pages.

## What's inside

```
slabworks/
├── index.html          all page markup/content
├── css/
│   └── styles.css      full design system + responsive layout + animations
├── js/
│   └── main.js         scroll reveal, counters, estimator, gallery filter, carousel, accordion
└── README.md
```

## Features

- **Instant Job Estimator** — the signature interactive piece. Visitors pick a floor
  type, coating system, area (m²) and slab condition, and get a live-calculated
  budget range in real time (`js/main.js`, `updateEstimate()`). Adjust the base
  rates/multipliers in that function to match your real pricing.
- Scroll-triggered reveal animations (`IntersectionObserver`), animated stat counters,
  an infinite marquee strip, sticky header, mobile nav, filterable portfolio gallery,
  auto-playing testimonial carousel, and an accessible FAQ accordion.
- Respects `prefers-reduced-motion` — animations are disabled automatically for users
  who've asked their OS for reduced motion.
- Fully responsive down to small mobile screens.
- Images are hotlinked from Unsplash (free-to-use license, no attribution required)
  so there are no binary assets to manage — swap them for your own job photos any time.

## Running it locally

No build tools needed. Either:

- Open `index.html` directly in a browser, or
- Serve it locally so relative paths behave exactly like production:
  ```bash
  python3 -m http.server 8000
  # then visit http://localhost:8000
  ```

## Deploying to GitHub Pages

1. Push this folder to a new GitHub repository (root of the repo, or a `/docs` folder
   — either works).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to "Deploy from a branch", pick your
   branch (e.g. `main`) and the folder (`/root` or `/docs`).
4. Save. GitHub will publish the site at `https://<username>.github.io/<repo>/`
   within a minute or two.

No `.nojekyll` or config file is required for a plain HTML/CSS/JS site like this one.

## Customizing

- **Branding**: search-and-replace `SLABWORKS` / `Slabworks`, the phone number
  (`1300 789 740`), email and license number across `index.html`.
- **Colors**: all colors are CSS custom properties at the top of `css/styles.css`
  (`:root { --ink, --orange, --steel, --concrete... }`) — change them once and the
  whole site updates.
- **Fonts**: loaded from Google Fonts in the `<head>` of `index.html`
  (Archivo / Archivo Black for headings, Inter for body text, JetBrains Mono for
  numbers and data).
- **Images**: every `<img src>` points to a hotlinked Unsplash photo. Replace with
  your own job photography — same `src` attribute, any hosted image URL works, or
  drop files into a local `/images` folder and update the paths.
- **Estimator pricing**: open `js/main.js`, find `pillGroups` / `data-rate` /
  `data-mult` attributes in `index.html` to change the base $/m² rates per floor
  type, coating system multiplier and slab-condition multiplier.

## Making the forms actually send email

Both the estimator form and the contact form currently do a **client-side-only**
"demo submit" (they validate, show a success state, and stop — nothing is emailed
anywhere, since a static GitHub Pages site has no backend). To make them real, the
easiest options are:

- **Formspree** (formspree.io) — add `action="https://formspree.io/f/yourFormId"
  method="POST"` to the `<form>` tags and remove/adjust the `preventDefault()` calls
  in `js/main.js` for that form.
- **Netlify Forms** — if you host on Netlify instead of GitHub Pages, add
  `data-netlify="true"` to the `<form>` tags.
- Any other form backend (Basin, Getform, your own serverless function) works the
  same way — point the form's `action` at the endpoint they give you.

## Browser support

Modern evergreen browsers (Chrome, Edge, Firefox, Safari). Uses `IntersectionObserver`,
CSS custom properties, `clip-path` and `backdrop-filter` — all broadly supported since
2020+.
