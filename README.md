# code-krishna.github.io

Personal academic website of Vamsi Krishna Pendyala, built with a simple custom Jekyll layout and served by GitHub Pages.

## Structure

```
_config.yml          Site title, description, contact links
_data/
  research.yml       Research highlight cards and their figures
  publications.yml   Papers, venues, links, BibTeX
  experience.yml     Jobs, dates, logos, bullets
  misc.yml           Education and honors & awards
_layouts/default.html  Page shell (head, footer, lightbox)
_includes/nav.html     Top navigation
index.html           The single page (sections)
assets/
  css/style.css      Styles (dark theme)
  js/main.js         Mobile menu, image lightbox, BibTeX toggle
  img/research/      Figures from the MiniFab papers
  img/logos/         Company and university logos
  img/headshot.jpg
  cv.pdf             Resume download
```

## Updating content

Most edits only touch the YAML files in `_data/`:

- **New paper:** add an entry at the top of `_data/publications.yml`. Put its figure in `assets/img/research/` and set `thumb:`.
- **New job:** add an entry to `_data/experience.yml`. Put the logo in `assets/img/logos/`.
- **New CV:** replace `assets/cv.pdf`.

Commit and push. GitHub Pages rebuilds automatically in about a minute.

## Local preview (optional)

```bash
bundle install
bundle exec jekyll serve
# open http://localhost:4000
```
