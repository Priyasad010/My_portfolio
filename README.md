# Lasitha Priyasad - Portfolio

Live site: https://priyasad010.github.io/My_portfolio/

A static portfolio (HTML, CSS, JavaScript) hosted on GitHub Pages. No build step.

## Nothing is added to the site automatically

Creating or pushing a GitHub repository never changes the portfolio by itself.
Content only appears when I decide to add it, in one of two ways below.

### Adding a GitHub project
**Option 1 - ask Claude** to add it as a featured project (screenshots, case study, links).

**Option 2 - the "More from GitHub" list (manual button):**
1. Give the repository a description (and optionally a Website link) on GitHub.
2. Add the topic `portfolio` to the repository.
3. Open Actions, choose **Sync GitHub projects**, click **Run workflow**.

Repositories without the `portfolio` topic are never listed, and the workflow does not run on a schedule.
Remove the topic and run the workflow again to take a project off the site.

### Adding a certificate
1. Upload the image (JPG or PNG) to `images/certificates/`.
   A small thumbnail is created by the "Certificate thumbnails" action (it only reacts to that upload).
2. Add one line at the top of the list in `data/certificates.js`:

   ```js
   { file: 'my-certificate.jpg', title: 'Course name', issuer: 'Who issued it', date: '12 Dec 2026' },
   ```

The certificate is shown only after step 2. The count on the page updates by itself.

### LinkedIn
LinkedIn has no free API for reading posts or certificates, so those are added by hand.

## Files

| Part | File |
| --- | --- |
| GitHub projects list (manual run) | `scripts/sync-repos.mjs`, `.github/workflows/sync-repos.yml` -> `data/repos.js` |
| Certificate thumbnails | `scripts/make-thumbs.mjs`, `.github/workflows/thumbnails.yml` |
| Certificates list | `data/certificates.js` |
| Lighthouse score check (report only) | `.github/workflows/lighthouse.yml`, `lighthouserc.json` |
