# WriteSpace Blog

A modern, responsive blog platform built with React and Vite. WriteSpace provides a clean, distraction-free reading and writing experience for content creators and readers alike.

## Tech Stack

- **React 18** — UI library with hooks and functional components
- **Vite** — Fast build tool and development server
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Utility-first CSS framework
- **PropTypes** — Runtime prop type checking

## Features

- Clean, minimal blog reading interface
- Responsive design for mobile, tablet, and desktop
- Dark mode support
- Blog post listing with search and filtering
- Individual blog post pages with rich content rendering
- Author profiles
- Tag-based categorization
- Loading states and error handling throughout
- Fast page transitions with client-side routing

## Folder Structure

```
writespace-blog/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, fonts, and other static files
│   ├── components/          # Reusable UI components
│   │   ├── common/          # Shared components (Button, Input, etc.)
│   │   ├── layout/          # Layout components (Header, Footer, Sidebar)
│   │   └── blog/            # Blog-specific components (PostCard, PostList)
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page-level route components
│   ├── services/            # API service modules
│   ├── utils/               # Utility functions and helpers
│   ├── context/             # React context providers
│   ├── App.jsx              # Root component with router
│   ├── main.jsx             # Application entry point
│   └── index.css            # Global styles and Tailwind directives
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── package.json             # Dependencies and scripts
└── README.md                # Project documentation
```

## Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The development server will start at [http://localhost:5173](http://localhost:5173) with hot module replacement enabled.

### 3. Build for Production

```bash
npm run build
```

The optimized production build will be output to the `dist/` directory.

### 4. Preview Production Build

```bash
npm run preview
```

Serves the production build locally for testing before deployment.

### 5. Lint

```bash
npm run lint
```

Runs ESLint to check for code quality issues.

## Environment Variables

Create a `.env` file in the project root for environment-specific configuration. All client-side variables must be prefixed with `VITE_`:

```env
VITE_API_BASE_URL=https://api.example.com
VITE_APP_TITLE=WriteSpace Blog
```

Access in code via `import.meta.env.VITE_API_BASE_URL`.

## Deployment on Vercel

### Option 1: Vercel Dashboard

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to [vercel.com](https://vercel.com) and sign in.
3. Click **"Add New Project"** and import your repository.
4. Vercel will auto-detect the Vite framework. Verify the settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add any required environment variables in the Vercel project settings.
6. Click **"Deploy"**.

### Option 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy from the project directory
vercel

# Deploy to production
vercel --prod
```

### Vercel Configuration

If needed, add a `vercel.json` for SPA routing support:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

This ensures all routes are handled by the React Router on the client side.

## Scripts Reference

| Script            | Command             | Description                          |
| ----------------- | -------------------- | ------------------------------------ |
| `npm run dev`     | `vite`               | Start development server with HMR    |
| `npm run build`   | `vite build`         | Create optimized production build    |
| `npm run preview` | `vite preview`       | Preview production build locally     |
| `npm run lint`    | `eslint .`           | Run ESLint code quality checks       |

## License

**Private** — All rights reserved. This project is proprietary and not licensed for public use, distribution, or modification.