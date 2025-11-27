# PHASE 6 – STEP 6 — Navigation & Footer (CMS-driven Menu + Footer Content)

## Goal

Implement a comprehensive **CMS-driven Navigation & Footer system** that allows editors to control the site navigation menu and footer content completely from the Django admin interface. The system supports full localization, custom ordering, and flexible linking options to CMS pages, destinations, blog categories, or external URLs. Next.js fetches and renders this content dynamically on every page.

The navigation and footer system includes:
- **NavigationMenuItem model** with flexible linking options
- **FooterBlock and FooterLink models** for structured footer content
- **Locale-aware content** for multilingual sites
- **Admin interfaces** with intuitive editing and ordering
- **API endpoints** for frontend consumption
- **React components** with responsive design and theme support

## Prerequisites

Ensure these components are in place:
- Django 5.1.14 backend with CMS models from previous phases
- Next.js 16.0.3 frontend with TypeScript and layout system
- Admin dashboard from Phase 5, Step 11
- Existing Page, Destination, and BlogCategory models for linking

## Files to Edit / Create

### Backend Models
- `cms/models.py` — Add NavigationMenuItem, FooterBlock, and FooterLink models

### Admin Interface
- `cms/admin.py` — Add admin classes for navigation and footer management
- `cms/admin_dashboard.py` — Add navigation/footer statistics
- `templates/admin/dashboard.html` — Add quick action links

### API Layer
- `cms/serializers.py` — Navigation and footer serializers
- `cms/views.py` — API endpoints for navigation and footer
- `cms/urls.py` — Add API URL patterns

### Frontend Components
- `frontend/lib/api/navigation.ts` — API client for navigation and footer
- `frontend/components/cms/Navigation.tsx` — CMS-driven navigation component
- `frontend/components/cms/Footer.tsx` — CMS-driven footer component
- `frontend/app/[locale]/layout.tsx` — Update layout to use CMS navigation/footer

## Step Instructions

### 1. Create CMS Models

Add navigation and footer models to `cms/models.py`:

```python
class NavigationMenuItem(models.Model):
    """Navigation menu item with locale-aware linking to CMS content or external URLs."""
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    label = models.CharField(max_length=100, help_text="Display text for the menu item")
    
    # Linking options - only one should be set
    url = models.CharField(max_length=255, blank=True, help_text="External URL")
    page = models.ForeignKey(Page, on_delete=models.CASCADE, blank=True, null=True)
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, blank=True, null=True)
    blog_category = models.ForeignKey(BlogCategory, on_delete=models.CASCADE, blank=True, null=True)
    
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    def clean(self):
        """Validate that exactly one linking option is set."""
        link_fields = [self.url, self.page, self.destination, self.blog_category]
        set_fields = [field for field in link_fields if field]
        
        if len(set_fields) != 1:
            raise ValidationError("You must specify exactly one linking option.")
    
    def get_url(self):
        """Return the appropriate URL for this menu item."""
        if self.url:
            return self.url
        elif self.page:
            return f"/{self.locale}/{self.page.slug}/"
        elif self.destination:
            return f"/{self.locale}/destinations/{self.destination.slug}/"
        elif self.blog_category:
            return f"/{self.locale}/blog/category/{self.blog_category.slug}/"
        return "#"

class FooterBlock(models.Model):
    """Footer content block with locale support."""
    locale = models.CharField(max_length=5, choices=SUPPORTED_LOCALES)
    title = models.CharField(max_length=100, help_text="Footer section title")
    body = models.TextField(blank=True, help_text="Footer section content (optional)")
    order = models.PositiveIntegerField(default=0)

class FooterLink(models.Model):
    """Links within a footer block."""
    block = models.ForeignKey(FooterBlock, related_name="links", on_delete=models.CASCADE)
    label = models.CharField(max_length=100, help_text="Link text")
    url = models.CharField(max_length=255, help_text="URL (can be relative or absolute)")
    order = models.PositiveIntegerField(default=0)
```

### 2. Configure Admin Interfaces

Update `cms/admin.py` to add navigation and footer admin classes:

```python
@admin.register(NavigationMenuItem)
class NavigationMenuItemAdmin(admin.ModelAdmin):
    list_display = ("label", "locale", "link_type_display", "order", "is_active", "dashboard_link")
    list_filter = ("locale", "is_active")
    search_fields = ("label", "url")
    ordering = ("locale", "order", "label")
    
    fieldsets = (
        ("Menu Item Information", {
            "fields": ("locale", "label", "order", "is_active")
        }),
        ("Link Target", {
            "fields": ("url", "page", "destination", "blog_category"),
            "description": "Choose ONE linking option."
        }),
    )

class FooterLinkInline(admin.TabularInline):
    model = FooterLink
    extra = 1
    fields = ("label", "url", "order")

@admin.register(FooterBlock)
class FooterBlockAdmin(admin.ModelAdmin):
    list_display = ("title", "locale", "link_count", "order", "dashboard_link")
    list_filter = ("locale",)
    inlines = [FooterLinkInline]
```

### 3. Create API Endpoints

Add serializers to `cms/serializers.py`:

```python
class NavigationMenuItemSerializer(serializers.ModelSerializer):
    href = serializers.SerializerMethodField()
    
    class Meta:
        model = NavigationMenuItem
        fields = ("label", "href", "order")
        
    def get_href(self, obj):
        return obj.get_url()

class FooterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FooterLink
        fields = ("label", "url")

class FooterBlockSerializer(serializers.ModelSerializer):
    links = FooterLinkSerializer(many=True, read_only=True)
    
    class Meta:
        model = FooterBlock
        fields = ("title", "body", "links", "order")
```

Add API views to `cms/views.py`:

```python
@api_view(["GET"])
def navigation_list(request: Request) -> Response:
    locale = request.query_params.get('locale', 'en')
    queryset = NavigationMenuItem.objects.filter(
        locale=locale, is_active=True
    ).order_by('order', 'label')
    serializer = NavigationMenuItemSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(["GET"])
def footer_list(request: Request) -> Response:
    locale = request.query_params.get('locale', 'en')
    queryset = FooterBlock.objects.filter(
        locale=locale
    ).prefetch_related('links').order_by('order', 'title')
    serializer = FooterBlockSerializer(queryset, many=True)
    return Response(serializer.data)
```

Add URLs to `cms/urls.py`:

```python
path("navigation/", views.navigation_list, name="cms-navigation-list"),
path("footer/", views.footer_list, name="cms-footer-list"),
```

### 4. Create Frontend API Client

Create `frontend/lib/api/navigation.ts`:

```typescript
export type NavigationItem = {
  label: string;
  href: string;
  order: number;
};

export type FooterBlock = {
  title: string;
  body: string;
  links: { label: string; url: string; }[];
  order: number;
};

export async function fetchNavigation(locale: Locale): Promise<NavigationItem[]> {
  const url = `${BASE_URL}/api/cms/navigation/?locale=${locale}`;
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) return [];
  const data = await response.json();
  return data.sort((a, b) => a.order - b.order);
}

export async function fetchFooter(locale: Locale): Promise<FooterBlock[]> {
  const url = `${BASE_URL}/api/cms/footer/?locale=${locale}`;
  const response = await fetch(url, { next: { revalidate: 60 } });
  if (!response.ok) return [];
  const data = await response.json();
  return data.sort((a, b) => a.order - b.order);
}
```

### 5. Create React Components

Create `frontend/components/cms/Navigation.tsx`:

```tsx
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationProps {
  items: NavigationItem[];
  locale: string;
}

export default function Navigation({ items, locale }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActiveLink = (href: string) => {
    if (href === `/${locale}` && pathname === `/${locale}`) return true;
    if (href !== `/${locale}` && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href={`/${locale}`} className="font-bold text-xl text-blue-600">
            TravelAcrossEU
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActiveLink(item.href)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Mobile menu button and responsive menu */}
        </div>
      </div>
    </nav>
  );
}
```

Create `frontend/components/cms/Footer.tsx`:

```tsx
'use client';
import React from 'react';
import Link from 'next/link';

interface FooterProps {
  blocks: FooterBlock[];
  locale: string;
}

export default function Footer({ blocks, locale }: FooterProps) {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {blocks.map((block, index) => (
            <div key={block.title} className="space-y-4">
              <h3 className="text-lg font-semibold">{block.title}</h3>
              {block.body && <p className="text-gray-300">{block.body}</p>}
              {block.links.length > 0 && (
                <ul className="space-y-2">
                  {block.links.map((link) => (
                    <li key={link.label}>
                      {link.url.startsWith('http') ? (
                        <a href={link.url} className="text-gray-300 hover:text-white">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.url} className="text-gray-300 hover:text-white">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

### 6. Update Layout

Update `frontend/app/[locale]/layout.tsx`:

```tsx
import CmsNavigation from "@/components/cms/Navigation";
import CmsFooter from "@/components/cms/Footer";
import { fetchNavigation, fetchFooter } from "@/lib/api/navigation";

export default async function LocaleLayout({ children, params }) {
  const locale = resolvedParams.locale;
  
  // Fetch CMS navigation and footer data
  const [navigationItems, footerBlocks] = await Promise.all([
    fetchNavigation(locale),
    fetchFooter(locale)
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <CmsNavigation items={navigationItems} locale={locale} />
      <main className="flex-1">{children}</main>
      <CmsFooter blocks={footerBlocks} locale={locale} />
    </div>
  );
}
```

### 7. Update Admin Dashboard

Add navigation and footer links to `templates/admin/dashboard.html`:

```html
<a href="{% url 'admin:cms_navigationmenuitem_changelist' %}" class="action-link">
  🧭 {% trans 'Navigation Menu' %}
</a>
<a href="{% url 'admin:cms_footerblock_changelist' %}" class="action-link">
  📄 {% trans 'Footer Blocks' %}
</a>
```

### 8. Run Database Migration

Create and apply the database migration for the new models.

## Commands

Reference commands for database migration and server management:

```cmd
cd /d C:\projects\travelacrosseu
.venv\Scripts\python.exe manage.py makemigrations cms
.venv\Scripts\python.exe manage.py migrate
.venv\Scripts\python.exe manage.py runserver
```

## What to Test

After completing the implementation, test these admin URLs and API endpoints:

### Admin Interface Testing
- http://127.0.0.1:8000/admin/dashboard/ (Navigation and Footer links in Quick Actions)
- http://127.0.0.1:8000/admin/cms/navigationmenuitem/ (Navigation menu items admin)
- http://127.0.0.1:8000/admin/cms/navigationmenuitem/add/ (Add new menu item)
- http://127.0.0.1:8000/admin/cms/footerblock/ (Footer blocks admin)
- http://127.0.0.1:8000/admin/cms/footerblock/add/ (Add new footer block)
- http://127.0.0.1:8000/admin/cms/footerlink/ (Individual footer links admin)

### API Endpoint Testing
- http://127.0.0.1:8000/api/cms/navigation/?locale=en (English navigation JSON)
- http://127.0.0.1:8000/api/cms/navigation/?locale=fr (French navigation JSON)
- http://127.0.0.1:8000/api/cms/footer/?locale=en (English footer JSON)
- http://127.0.0.1:8000/api/cms/footer/?locale=fr (French footer JSON)

### Frontend Testing
- http://localhost:3000/en (Homepage with CMS navigation and footer)
- http://localhost:3000/fr (French homepage with localized content)
- http://localhost:3000/es (Spanish homepage)
- http://localhost:3000/en/about (About page with navigation)
- http://localhost:3000/en/destinations (Destinations with navigation)
- http://localhost:3000/en/blog (Blog with navigation)

### Editor Testing Workflow

1. **Create Navigation Items**: Add menu items linking to different content types
2. **Test Linking Options**: Create items linking to pages, destinations, categories, and external URLs
3. **Configure Footer**: Add footer blocks with titles, content, and links
4. **Test Localization**: Create navigation and footer content for multiple locales
5. **Verify Ordering**: Test the order field to control menu and footer arrangement
6. **Mobile Testing**: Verify responsive navigation works on mobile devices

## Notes / Pitfalls

### Navigation Menu Configuration
- Only one linking option (URL, page, destination, blog_category) should be set per menu item
- The `clean()` method validates linking rules in the admin form
- Order field controls menu sequence - lower numbers appear first
- Active/inactive toggle allows temporary hiding of menu items without deletion

### Footer Content Management
- Footer blocks are organized by locale for multilingual sites
- Footer links within blocks support both relative and absolute URLs
- Empty footer blocks display default content as fallback
- Footer links automatically detect external URLs for proper target handling

### API Performance
- Navigation and footer APIs use caching with 60-second revalidation
- Prefetch related links in footer queries for optimal performance
- API responses are sorted by order field for consistent display

### Frontend Integration
- Layout fetches navigation and footer data during server-side rendering
- Components include fallback content when CMS data is unavailable
- Navigation includes mobile-responsive hamburger menu with proper accessibility
- Active link detection works with locale-aware URL patterns

### Localization Considerations
- All navigation and footer content is locale-specific
- URL building includes locale prefix for proper routing
- API endpoints filter by locale parameter for targeted content
- Fallback to default locale (English) when requested locale is unavailable

### Admin Usability
- Dashboard includes quick links to navigation and footer management
- Admin forms include helpful field descriptions for linking rules
- List views show link targets and locale information for easy management
- Inline editing for footer links within footer block admin

### Browser Compatibility
- Navigation component uses modern CSS Grid and Flexbox
- Mobile menu functionality uses React hooks for state management
- SVG icons used instead of external icon libraries for compatibility
- Responsive design adapts to various screen sizes

### Security Considerations
- External URLs in navigation/footer should be validated for safety
- API endpoints are currently open but can be secured in production
- Footer link URLs support both internal routing and external links
- Input validation prevents XSS through proper escaping in templates

### Performance Optimization
- Navigation and footer data cached at layout level
- Database queries optimized with proper select_related and prefetch_related
- API responses include minimal required fields for fast loading
- Revalidation strategy balances fresh content with performance