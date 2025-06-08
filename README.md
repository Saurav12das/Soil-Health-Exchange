# Soil Health Exchange

This repository contains a single-page React application for exploring soil health questions and answers.

## Running Locally

1. Open `index.html` in a modern web browser **or** serve the directory with a static file server.
   For example, using `npx serve`:

   ```bash
   npx serve .
   ```

2. Navigate to the provided local address to view the site.

The application relies on CDN-hosted dependencies, so no build step is required.

## Deploying with GitHub Pages

1. Ensure the repository contains a `.github/workflows/pages.yml` file using the
   [GitHub Pages action](https://github.com/actions/deploy-pages). On every push
   to `main`, the workflow uploads the site files and publishes them to the
   `gh-pages` branch automatically.
2. Enable GitHub Pages in the repository settings and select **GitHub Actions**
   as the source.
3. To use a custom domain, create a `CNAME` file in the repository root
   containing the desired domain name. GitHub Pages will use this domain once the
   DNS records point to GitHub.
