from django.conf import settings


FRONTEND_BASE_URL = getattr(settings, "FRONTEND_BASE_URL", "http://localhost:3000")


def get_frontend_url(page_slug: str, locale: str) -> str:
    """
    Build the frontend URL for a given page slug and locale.
    
    Args:
        page_slug: The page slug ('home', 'about', 'contact', etc.)
        locale: The locale code ('en', 'fr', 'nl', 'es', 'pt')
        
    Returns:
        The full frontend URL for the page in the given locale.
    """
    if page_slug == "home":
        return f"{FRONTEND_BASE_URL}/{locale}"
    
    return f"{FRONTEND_BASE_URL}/{locale}/{page_slug}"