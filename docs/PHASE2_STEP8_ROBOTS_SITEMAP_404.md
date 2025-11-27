# PHASE 2 – STEP 8 — robots.txt, sitemap.xml, and 404 Page

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
- Provide search engines with a robots.txt that references a sitemap hosted by the frontend.
- Generate a dynamic sitemap that enumerates every locale route and destination detail page pulled from the Django API.
- Offer a branded 404 experience so broken URLs do not fall back to the default Next.js error output.

## Files Updated / Added
- `frontend/.env.local` — new `NEXT_PUBLIC_SITE_URL=http://localhost:3000` entry used by robots + sitemap (to be swapped for production deploys).
- `frontend/app/robots.ts` — Metadata route that allows all crawlers and links to `/sitemap.xml`.
- `frontend/app/sitemap.ts` — Async metadata route that compiles locale roots plus `/destinations`, `/about`, `/contact`, and every `/destinations/[slug]` fetched per locale via `fetchTravelPages`.
- `frontend/app/not-found.tsx` — Custom 404 layout with CTA buttons back to `/en` and `/en/destinations`.
- `docs/PHASE2_STEP8_ROBOTS_SITEMAP_404.md` — this document.

## Commands Run
```cmd
C:\projects\travelacrosseu\scripts\phase1_step5_runserver.cmd
C:\projects\travelacrosseu\scripts\phase2_step1_dev_window.cmd
curl http://localhost:3000/robots.txt
curl http://localhost:3000/sitemap.xml
curl http://localhost:3000/en/does-not-exist
taskkill /IM node.exe /F
taskkill /IM python.exe /F
```

## Verification Checklist
- [x] `/robots.txt` returns the expected `User-Agent: *` rule set and references `http://localhost:3000/sitemap.xml`.
- [x] `/sitemap.xml` renders valid XML including locale roots plus demo destination detail URLs fetched from the API.
- [x] Visiting a nonexistent path (e.g., `/en/does-not-exist`) renders the new 404 layout with navigation CTAs.
- [x] No runtime/TypeScript errors while the dev server handled robots, sitemap, and 404 routes.
- [x] Backend and frontend dev processes were stopped via `taskkill` when verification completed.
