# PHASE 1 – STEP 7 — Seed Demo Travel Data

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
Seed reusable demo content so that `/api/pages/` and the Next.js frontend render real destinations instead of fallback placeholders.

## Implementation Notes
- Added Django management command packages under `core/management/` and `core/management/commands/`.
- Implemented `seed_demo_travelpages` to create baseline countries (PT, FR, NL), cities (Lisbon, Paris, Amsterdam), categories (City Breaks, Coastal & Seaside), and three published English `TravelPage` entries.
- Created helper CMD scripts to run the seed command repeatedly and to inspect the resulting records without relying on shell history.

## Commands Executed
1. `C:\projects\travelacrosseu\scripts\phase1_step7_seed_demo.cmd`
2. `C:\projects\travelacrosseu\scripts\phase1_step7_seed_demo.cmd` (rerun to confirm idempotence)
3. `C:\projects\travelacrosseu\scripts\phase1_step7_check_pages.cmd`

Each seed execution printed `Seeding demo travel data...` followed by `Demo travel data seeded. New pages created: X`. The second pass reported `0`, proving idempotence. The verification script output:

```
Total pages: 3
[{'title': 'Amsterdam Weekend, Netherlands', 'country__name': 'Netherlands', 'city__name': 'Amsterdam'},
 {'title': 'Paris Getaway, France', 'country__name': 'France', 'city__name': 'Paris'},
 {'title': 'Lisbon City Break, Portugal', 'country__name': 'Portugal', 'city__name': 'Lisbon'}]
```

## Behavior After Seeding
- `/api/pages/?language=en` now returns three published destinations (Lisbon, Paris, Amsterdam) backed by real `TravelPage` rows.
- The homepage and `/en/destinations` can render these entries immediately once the frontend requests the API.
- Subsequent runs of `seed_demo_travelpages` skip already-seeded records, keeping the database clean.

## Verification Checklist
- [x] `core/management/commands/seed_demo_travelpages.py` exists.
- [x] `python manage.py seed_demo_travelpages` runs without errors (via `scripts\phase1_step7_seed_demo.cmd`).
- [x] Running the command twice does not duplicate demo entries (`New pages created: 0` on the second run).
- [x] `/api/pages/?language=en` serves the newly seeded pages (confirmed through the Django shell query above).
- [x] Frontend homepage can now display real destinations instead of fallback text once it fetches the API.
- [x] `/en/destinations` renders the seeded pages grid using the same API response.
