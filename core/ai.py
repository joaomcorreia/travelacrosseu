"""Utilities for generating travel content with OpenAI."""

from __future__ import annotations

import os
from typing import Optional, TypedDict

from openai import OpenAI


class TravelPageDraft(TypedDict):
    """Structured draft payload returned by the AI helper."""

    title: str
    summary: str
    body: str


def get_openai_client() -> Optional[OpenAI]:
    """Return an OpenAI client if OPENAI_API_KEY is configured."""

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)


def generate_travel_page_draft(
    *,
    language: str,
    country: str,
    city: Optional[str] = None,
    category: Optional[str] = None,
    tone: str = "friendly and informative",
) -> TravelPageDraft:
    """Generate a structured travel guide draft without persisting it."""

    client = get_openai_client()
    if client is None:
        raise RuntimeError("OPENAI_API_KEY is not configured in the environment.")

    location_label = city if city else country

    system_prompt = (
        "You are an assistant that creates concise, structured travel guides for European destinations. "
        "Always respond in the requested language (by language code), keep the tone {tone}, and focus on practical, clear "
        "information suitable for a public travel website."
    ).format(tone=tone)

    user_prompt = [
        "Create content for a travel page.",
        f"Language code: {language}",
        f"Country: {country}",
    ]
    if city:
        user_prompt.append(f"City: {city}")
    if category:
        user_prompt.append(f"Theme/Category: {category}")

    user_prompt.extend(
        [
            "",
            "Return three parts in plain text (no markdown, no bullet points):",
            "1) A short, SEO-friendly title on a single line.",
            "2) A 1–2 sentence summary.",
            "3) A 3–6 paragraph body with useful, realistic travel information.",
            "Separate the three parts with a blank line between them.",
        ]
    )

    prompt_text = "\n".join(user_prompt)

    completion = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt_text},
        ],
    )

    content = completion.choices[0].message.content or ""
    parts = [p.strip() for p in content.split("\n\n") if p.strip()]

    title = parts[0] if len(parts) > 0 else f"{location_label} Travel Guide"
    summary = parts[1] if len(parts) > 1 else f"A short guide to {location_label}."
    body = "\n\n".join(parts[2:]) if len(parts) > 2 else content

    return {
        "title": title,
        "summary": summary,
        "body": body,
    }
