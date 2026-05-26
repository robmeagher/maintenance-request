# New Maintenance Request

A Next.js recreation of the maintenance request form, ready to deploy on Vercel.

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deploy to Vercel

**Option A — Git (recommended):**
1. Push this folder to a GitHub/GitLab/Bitbucket repo.
2. Go to https://vercel.com/new and import the repo.
3. Vercel auto-detects Next.js — no configuration needed. Click **Deploy**.

**Option B — Vercel CLI:**
```bash
npm i -g vercel
vercel        # follow the prompts
vercel --prod # deploy to production
```

## Project structure

```
pages/
  index.js        # the form (React)
  _app.js         # loads global styles
  api/submit.js   # serverless endpoint that receives submissions
styles/
  globals.css     # all styling
```

## Notes / next steps

- **File uploads aren't wired up.** The Photo/Video inputs render, but the
  serverless endpoint only receives text fields. To handle real files, send
  the form as `multipart/form-data` (e.g. with `formidable`) or upload to
  Vercel Blob / S3 from the browser and POST the resulting URLs.
- **Submissions currently just log + return a confirmation.** Replace the
  body of `pages/api/submit.js` with a database write, email, or ticket
  creation call.
- **Dropdown options** (severity, categories, time slots, criteria) are
  reasonable guesses since the originals only showed "Select" placeholders.
  Edit the arrays at the top of `pages/index.js` to match your real values.
```
