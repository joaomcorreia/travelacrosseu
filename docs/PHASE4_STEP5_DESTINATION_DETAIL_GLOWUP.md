# PHASE 4 – STEP 5 — Destination Detail Glow-Up

> Shell: All commands in this step must be run in **Windows Command Prompt (CMD)**, not PowerShell.

## Purpose
- Keep every destination detail route aligned with the Phase 4 hero/summary/content grid so it feels premium before real booking modules arrive.
- Split long-form AI copy into easy-to-read paragraphs and pin a planning sidebar (trip essentials, timing, expectations) next to the main story.
- Reuse both LanguageSwitcher variants so translation state stays visible whether you are in the header or at the bottom of the article.

## Files Updated / Created
- `frontend/app/[locale]/destinations/[slug]/page.tsx`
- `docs/PHASE4_STEP5_DESTINATION_DETAIL_GLOWUP.md`

## Design Decisions
- **Gradient hero + summary card:** Hybrid light hero plus frosted summary block show locale, country, and overview text before readers hit the article body.
- **Paragraphized article body:** TravelPage `body` text is split on blank lines (with fallback to the lead summary) to avoid walls of text in the main column.
- **Trip essentials aside:** City, EU grouping, travel style, and primary language sit inside a sticky aside with timing/length/good-to-know cards for quick planning context.
- **Dual LanguageSwitchers:** The compact `<details>` switcher remains near the breadcrumbs while the `panel` variant appears in the dark content block so locale availability is obvious mid-article.
- **Graceful translation gaps:** Missing locales route to the shared not-found hero, keeping the experience polished even when a slug is only translated in English today.

## Commands Run
1. `cmd /c start "" cmd /c "cd /d C:\projects\travelacrosseu & scripts\phase2_step1_dev.cmd"`
2. `cmd /c "cd /d C:\projects\travelacrosseu & scripts\curl_frontend_page.cmd /en/destinations/lisbon-portugal-city-break"`
3. `cmd /c "cd /d C:\projects\travelacrosseu & scripts\curl_frontend_page.cmd /fr/destinations/paris-france-city-break"`
4. `cmd /c "cd /d C:\projects\travelacrosseu & C:\Windows\System32\taskkill.exe /IM node.exe /F"`
5. `cmd /c start "" cmd /c "cd /d C:\projects\travelacrosseu & scripts\phase2_step1_dev.cmd"`
6. `cmd /c "cd /d C:\projects\travelacrosseu & scripts\curl_frontend_page.cmd /pt/destinations/lisbon-portugal-city-break"`
7. `cmd /c "cd /d C:\projects\travelacrosseu & C:\Windows\System32\taskkill.exe /IM node.exe /F"`

## Verification Checklist
- [x] `/en/destinations/lisbon-portugal-city-break` renders the hero tags, summary card, paragraphized article, trip essentials, and both LanguageSwitcher variants without console errors.
- [x] `/fr/destinations/paris-france-city-break` currently lacks a translation, so it reaches the shared not-found hero and still keeps navigation + locale controls intact.
- [x] `/pt/destinations/lisbon-portugal-city-break` shows the same graceful not-found behavior when the CMS does not provide Portuguese copy yet.
- [x] Header navigation and both LanguageSwitchers stay in sync across the article and not-found experiences.
- [x] Dev server stops cleanly via `taskkill` after each set of curl checks so port 3000 stays free for the next run.
