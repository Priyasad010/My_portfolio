# Lasitha Priyasad - Portfolio

Live site: https://priyasad010.github.io/My_portfolio/

A static portfolio (HTML, CSS, JavaScript) hosted on GitHub Pages. No build step.

## Keeping it up to date

### New GitHub project (automatic)
1. Give the repository a **description** (and, optionally, a **Website** link) on GitHub.
2. Add the topic **`portfolio`** to the repository (About, gear icon, Topics).
3. Within about 6 hours the repository appears under **More from GitHub**.
   To refresh immediately: Actions tab, "Sync GitHub projects", Run workflow.

Only public, non-fork, non-archived repositories with the `portfolio` topic are shown.
Remove the topic and the project disappears from the site.

### New certificate
1. Upload the image (JPG or PNG) to `images/certificates/`.
   A small thumbnail is created automatically by the "Certificate thumbnails" action.
2. Add one line at the top of the list in `data/certificates.js`:

   ```js
   { file: 'my-certificate.jpg', title: 'Course name', issuer: 'Who issued it', date: '12 Dec 2026' },
   ```

The certificate count on the page updates by itself.

### LinkedIn
LinkedIn has no free API for reading posts or certificates, so those are added by hand
(see the two steps above).

## How it works

| Part | File |
| --- | --- |
| GitHub projects list | `scripts/sync-repos.mjs`, `.github/workflows/sync-repos.yml` -> `data/repos.js` |
| Certificate thumbnails | `scripts/make-thumbs.mjs`, `.github/workflows/thumbnails.yml` |
| Certificates list | `data/certificates.js` |
| Lighthouse score check | `.github/workflows/lighthouse.yml`, `lighthouserc.json` |

Note: GitHub pauses scheduled workflows in a repository that has had no activity for 60 days.
If the automatic sync stops, open the Actions tab and re-enable it.
