
---

## 2️⃣ PHASE6_STEP2 — doc to add

Create this file:

**`docs/PHASE6_STEP2 AI-Assisted Content Workflow (Optional).md`**

This one just formalizes the “use AI to generate content shapes” idea. Even if you don’t use it now, it keeps the numbering clean.

```md
# PHASE 6 – STEP 2 — AI-Assisted Content Workflow (Optional)

## Goal

Define a repeatable way to use AI tools (ChatGPT, Claude) to generate structured content that fits the TravelAcrossEU CMS fields (titles, SEO, hero intro, sections).  
This step is optional but recommended to speed up writing page, destination, and blog content.

## Prerequisites

- PHASE 6 – STEP 1 completed with at least one real page, destination, and blog post created by hand.
- CMS models and admin from all Phase 5 steps.
- Access to an AI assistant (ChatGPT or Claude) with the ability to paste prompts and copy results.

## Files to Edit / Create

No code changes in this step.  
Only content entries in Django admin:

- `PageTranslation`
- `DestinationTranslation`
- `BlogPostTranslation`
- Section models (PageSection, DestinationSection, BlogPostSection).

## Step Instructions

1. **Define standard content structure for pages**

   When creating or editing pages (home, about, contact, marketing pages), aim for this structure:

   - Page fields:
     - `title`
     - `subtitle`
     - `meta_title`
     - `meta_description`
     - body / hero intro
   - Sections:
     - 2–6 sections mixing:
       - text
       - text + image
       - CTA

   Use a reusable AI prompt pattern that asks for JSON containing these elements so it can be pasted easily into admin fields.

2. **Use AI prompt template for pages**

   Keep a prompt template (for example in a notes file) that asks AI to output:

   ```json
   {
     "title": "",
     "subtitle": "",
     "meta_title": "",
     "meta_description": "",
     "hero_paragraph": "",
     "sections": [
       { "section_type": "text", "title": "", "body": "" },
       { "section_type": "text_image", "title": "", "body": "", "image_hint": "" },
       { "section_type": "cta", "title": "", "body": "", "cta_label": "", "cta_url_hint": "" }
     ]
   }
After AI responds, copy values into the PageTranslation and PageSection fields for the corresponding locale.

Use AI prompt template for destinations

For a destination (Country → City → Destination):

Ask AI to write:

A strong title and subtitle.

SEO meta title and description.

3–6 sections (why visit, when to go, where to stay, suggested itinerary, CTA to book).

Paste results into DestinationTranslation and DestinationSection entries for that destination.

Use AI prompt template for blog posts

For a blog post:

Ask AI for:

title

subtitle

meta title

meta description

hero intro paragraph

section list (overview, tips, where to stay, daily itinerary, CTA).

Paste into BlogPostTranslation and BlogPostSection in admin.

Review and adjust manually

Always skim AI output and correct anything inaccurate.

Adjust tone to match TravelAcrossEU style (helpful, simple, not fake or exaggerated).

Translate to other locales later when time allows, using similar structured prompts.

Commands
Reference only; no code changes in this step.

cmd
Copy code
cd /d C:\projects\travelacrosseu
.venv\Scripts\activate
python manage.py runserver
cmd
Copy code
cd /d C:\projects\travelacrosseu\frontend
npm run dev
What to Test
http://127.0.0.1:8000/admin/cms/page/

http://127.0.0.1:8000/admin/cms/destination/

http://127.0.0.1:8000/admin/cms/blogpost/

http://localhost:3000/en

http://localhost:3000/en/destinations

http://localhost:3000/en/blog

Notes / Pitfalls
Treat AI output as a first draft, not final truth.

Keep slugs and SEO metadata consistent when generating content in multiple languages.

This step can be skipped in development; it exists to document how AI can support content creation once the CMS is stable.