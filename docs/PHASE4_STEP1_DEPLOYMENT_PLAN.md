# PHASE 4 – STEP 1 — Deployment Plan

## 1. Overview

TravelAcross EU consists of two deployable surfaces:

- **Backend** — Django + DRF project (`backend`) exposing `/api/` for the Next.js frontend plus `/admin/` for staff operations. It relies on the OpenAI helper for AI content creation.
- **Frontend** — Next.js 16 (App Router + Tailwind) located in `frontend/`. It serves the public pages (`/`, `/[locale]`, `/[locale]/destinations`, etc.) and fetches JSON data from the Django API.

In production we will run both services on the same Linux server. Django will run behind Gunicorn/WSGI (via CyberPanel’s Python App), while the Next.js app will run on its own port (e.g., 3000). OpenLiteSpeed/CyberPanel will proxy `/api/` and `/admin/` to Django and route all other requests to the Next.js process.

## 2. Required Environment (Server)

- Linux server with CyberPanel + OpenLiteSpeed (or equivalent reverse proxy).
- Python 3.11 (matching local development).
- Node.js LTS (20.x recommended).
- Git (to pull the repository).
- Ability to create and manage Python virtual environments.
- Ability to run Node processes (e.g., `npm run start`, PM2, or CyberPanel’s Node app manager).
- Access to set environment variables and manage `.env` files for both Django and Next.js.
- OpenAI API key available for production use.

## 3. Backend – Django Deployment Checklist

All commands below assume a Linux shell on the server (no Windows CMD).

1. Clone the repository and enter it:
   ```bash
   cd /var/www
   git clone https://github.com/<org>/travelacrosseu.git
   cd travelacrosseu
   ```
2. Create a Python virtual environment and install dependencies:
   ```bash
   python3.11 -m venv .venv
   source .venv/bin/activate
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
3. Create `.env` in the project root with production values:
   ```env
   DJANGO_SECRET_KEY=replace-me
   DJANGO_DEBUG=false
   DJANGO_ALLOWED_HOSTS=travelacross.eu,www.travelacross.eu
   DJANGO_CSRF_TRUSTED_ORIGINS=https://travelacross.eu,https://www.travelacross.eu
   DJANGO_CORS_ALLOWED_ORIGINS=https://travelacross.eu,https://www.travelacross.eu
   OPENAI_API_KEY=sk-...
   ```
4. Apply migrations and collect static assets:
   ```bash
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```
5. Configure CyberPanel’s Python App to point to `backend/wsgi.py`, using the `.venv` you created. Ensure the working directory is the project root.
6. Map static and media directories (if any) so OpenLiteSpeed serves them efficiently (e.g., `STATIC_ROOT`, `MEDIA_ROOT`).
7. Configure OpenLiteSpeed/CyberPanel to reverse proxy `/api/` and `/admin/` to the Python App.

## 4. Frontend – Next.js Deployment Checklist

1. On the same server, go into the frontend directory:
   ```bash
   cd /var/www/travelacrosseu/frontend
   ```
2. Create a production env file (`.env.production` or `.env.local`) with live values:
   ```env
   NEXT_PUBLIC_SITE_URL=https://travelacross.eu
   NEXT_PUBLIC_API_BASE_URL=https://travelacross.eu
   ```
3. Install dependencies and build the production bundle:
   ```bash
   npm install
   npm run build
   ```
4. Start the Next.js server (adjust tooling as needed):
   ```bash
   npm run start -- -p 3000
   ```
   Use a process manager (PM2/systemd/CyberPanel’s Node app) to keep it running.
5. Configure OpenLiteSpeed/CyberPanel to route:
   - Root domain traffic (`https://travelacross.eu`) → Next.js app (port 3000).
   - `/api/` and `/admin/` → Django Python App.
   - Optional: add caching/CDN layers if desired once the base deployment works.

## 5. Production Env Summary Table

| Component | Variable                | Example Value                         |
|-----------|-------------------------|---------------------------------------|
| Django    | DJANGO_DEBUG            | false                                 |
| Django    | DJANGO_ALLOWED_HOSTS    | travelacross.eu,www.travelacrosse.eu  |
| Django    | OPENAI_API_KEY          | sk-*********************************** |
| Next.js   | NEXT_PUBLIC_SITE_URL    | https://travelacross.eu               |
| Next.js   | NEXT_PUBLIC_API_BASE_URL| https://travelacross.eu               |

## 6. Post-Deploy Checklist

- ✅ Visit `https://travelacross.eu/` and `https://travelacross.eu/en` to confirm the frontend renders correctly.
- ✅ Check `https://travelacross.eu/en/destinations` plus a destination detail page.
- ✅ Verify `https://travelacross.eu/robots.txt` and `https://travelacross.eu/sitemap.xml` return the expected content.
- ✅ Log into `https://travelacross.eu/admin/` and run both AI admin actions to ensure OpenAI access works on the server.
- ✅ Add the domain to Google Search Console and submit `https://travelacross.eu/sitemap.xml` for indexing.
