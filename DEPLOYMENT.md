# Deployment Guide — WriteSpace Blog

## Overview

WriteSpace Blog is a static Single Page Application (SPA) built with React 18 and Vite. It requires no server-side runtime and no environment variables, making deployment straightforward on any static hosting platform. This guide covers deployment to **Vercel**.

---

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier is sufficient)
- The project repository pushed to GitHub, GitLab, or Bitbucket
- Node.js 18+ installed locally (for testing builds before deployment)

---

## Build Commands

### Local Build

```bash
npm install
npm run build
```

This produces a `dist/` directory containing the fully static production build.

### Local Preview

```bash
npm run preview
```

Starts a local server serving the production build on `http://localhost:4173` for verification before deploying.

---

## Vercel Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Log in to [vercel.com](https://vercel.com) and click **"Add New Project"**.
2. Import your Git repository containing the WriteSpace Blog source code.
3. Vercel auto-detects the Vite framework. Confirm the following settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
4. Click **"Deploy"**.
5. Vercel builds the project and provides a production URL (e.g., `https://writespace-blog.vercel.app`).

Every subsequent push to the main branch triggers an automatic redeployment.

### Option 2: Deploy via Vercel CLI

```bash
# Install the Vercel CLI globally
npm install -g vercel

# From the project root, run:
vercel

# Follow the prompts:
# - Link to your Vercel account
# - Confirm project settings
# - Deploy
```

For production deployment:

```bash
vercel --prod
```

---

## vercel.json Configuration

The `vercel.json` file at the project root configures Vercel's behavior for the SPA:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Explanation

| Key | Purpose |
|-----|---------|
| `rewrites` | An array of rewrite rules applied to incoming requests. |
| `source: "/(.*)"` | A regex pattern matching **all** request paths — every URL the user navigates to. |
| `destination: "/index.html"` | Rewrites all matched requests to serve `index.html`, the SPA entry point. |

#### Why This Is Necessary

WriteSpace Blog uses **client-side routing** (React Router with `createBrowserRouter`). When a user navigates to a route like `/post/hello-world`, the browser sends a request to the server for that path. Without the rewrite rule, Vercel would return a **404** because no physical file exists at `/post/hello-world`.

The rewrite rule ensures that:

1. **All routes** resolve to `index.html` on the server side.
2. Once `index.html` loads, React Router reads the URL from the browser's address bar and renders the correct component.
3. **Static assets** (JS, CSS, images in the `dist/assets/` directory) are still served normally because Vercel serves existing files before applying rewrite rules.

This is the standard pattern for deploying any SPA with client-side routing to Vercel.

---

## Environment Variables

**No environment variables are required.** WriteSpace Blog is a fully self-contained static application:

- Blog post data is stored locally within the application.
- There are no external API calls requiring keys or secrets.
- There is no backend server or database connection.

If you extend the application in the future to include external services (e.g., a CMS API, analytics, or authentication), you would add environment variables in the Vercel dashboard under **Settings → Environment Variables** and access them in code via `import.meta.env.VITE_*` (Vite requires the `VITE_` prefix for client-exposed variables).

---

## SPA Rewrite Behavior — Deep Dive

### How Client-Side Routing Works with Static Hosting

```
User visits: https://writespace-blog.vercel.app/post/my-article

1. Browser sends GET /post/my-article to Vercel's edge network
2. Vercel checks: does /post/my-article exist as a static file? → No
3. Vercel applies rewrite: serve /index.html (with 200 status)
4. Browser receives index.html → loads JS bundle
5. React Router initializes → reads URL → renders <PostDetail> component
```

### Key Behaviors

- **Hard refresh on any route** — Works correctly. The rewrite ensures `index.html` is always served.
- **Direct link sharing** — Works correctly. Recipients land on the correct page.
- **Browser back/forward buttons** — Handled entirely by React Router on the client side; no server requests are made.
- **Static assets (`/assets/*`)** — Served directly from the `dist/assets/` directory. Vercel serves existing files before applying rewrites, so JS, CSS, and image files load normally.
- **404 handling** — Since all routes resolve to `index.html`, a "not found" page must be handled within the React application itself via a catch-all route in React Router.

---

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Blank page after deploy | Build output directory misconfigured | Ensure output directory is set to `dist` in Vercel settings |
| 404 on page refresh | Missing rewrite rule | Add `vercel.json` with the rewrite configuration shown above |
| Styles missing | Build not completing successfully | Check the Vercel build logs for errors; run `npm run build` locally to verify |
| Old content after deploy | Browser cache | Hard refresh (`Ctrl+Shift+R`) or clear cache; Vite uses content-hashed filenames so this is rare |

---

## Additional Notes

- **Branch Previews:** Vercel automatically creates preview deployments for pull requests, each with a unique URL. This is useful for reviewing changes before merging.
- **Custom Domains:** In the Vercel dashboard under **Settings → Domains**, you can add a custom domain. The rewrite rules apply to custom domains as well.
- **Performance:** Vite's production build includes code splitting, tree shaking, and asset hashing. Vercel's edge network provides global CDN distribution automatically.