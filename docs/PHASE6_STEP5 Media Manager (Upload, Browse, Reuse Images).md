# PHASE 6 – STEP 5 — Media Manager (Upload, Browse, Reuse Images)

## Goal

Implement a comprehensive **Django Media Manager** within the admin interface that allows editors to upload, browse, search, reuse, and delete images across all CMS content. This system provides a centralized media library that integrates seamlessly with the existing admin dashboard and offers both admin interface and API endpoints for future frontend admin development.

The media manager includes:
- **MediaFile model** for storing image metadata
- **Custom admin interface** with thumbnail grid view
- **Search and filtering** capabilities
- **Copy URL functionality** for easy reuse
- **Dashboard integration** with quick access links
- **API endpoints** for future frontend admin features

## Prerequisites

Ensure these components are in place:
- Django 5.1.14 backend running successfully
- CMS models and admin interfaces from previous phases
- Admin dashboard from Phase 5, Step 11
- Media file serving configuration in settings.py

## Files to Edit / Create

### Backend Models
- `cms/models.py` — Add MediaFile model with image handling

### Admin Interface  
- `cms/admin.py` — Add MediaFileAdmin with custom actions
- `cms/admin_urls.py` — Custom media library view and URLs
- `cms/admin_dashboard.py` — Add media statistics
- `backend/urls.py` — Wire custom admin URLs
- `templates/admin/dashboard.html` — Add media library links
- `templates/admin/media_library_list.html` — Custom media grid template

### API Layer
- `cms/serializers.py` — MediaFile serializer for API
- `cms/views.py` — Media list API endpoint
- `cms/urls.py` — Add media API URL

## Step Instructions

### 1. Create MediaFile Model

Add the MediaFile model to `cms/models.py`:

```python
import os
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify

class MediaFile(models.Model):
    """Media file for reusable images across the CMS."""
    file = models.ImageField(upload_to="uploads/")
    name = models.CharField(max_length=255, blank=True, help_text="Display name for this media file")
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_size = models.PositiveIntegerField(blank=True, null=True, help_text="File size in bytes")
    
    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Media File"
        verbose_name_plural = "Media Files"
    
    def save(self, *args, **kwargs):
        # Auto-fill name from filename if not provided
        if not self.name and self.file:
            filename = os.path.basename(self.file.name)
            name_without_ext = os.path.splitext(filename)[0]
            self.name = name_without_ext.replace('_', ' ').replace('-', ' ').title()
        
        # Store file size
        if self.file and hasattr(self.file, 'size'):
            self.file_size = self.file.size
            
        super().save(*args, **kwargs)
    
    def thumbnail(self):
        """Return the URL for thumbnail display."""
        return self.file.url if self.file else ""
    
    def get_file_size_display(self):
        """Return human-readable file size."""
        if not self.file_size:
            return "Unknown"
        
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.1f} {unit}"
            size /= 1024
        return f"{size:.1f} TB"
    
    def __str__(self) -> str:
        return f"{self.name} ({self.get_file_size_display()})"
```

### 2. Configure Admin Interface

Update `cms/admin.py` to add MediaFile admin:

```python
from cms.models import MediaFile

@admin.register(MediaFile)
class MediaFileAdmin(admin.ModelAdmin):
    """Admin interface for media file management."""
    list_display = ("thumbnail_preview", "name", "file_name", "get_file_size_display", "uploaded_at", "copy_url_action")
    list_filter = ("uploaded_at",)
    search_fields = ("name", "file")
    readonly_fields = ("uploaded_at", "file_size", "thumbnail_preview", "file_url")
    ordering = ("-uploaded_at",)
    
    fieldsets = (
        ("Media Information", {
            "fields": ("name", "file", "thumbnail_preview", "file_url")
        }),
        ("Metadata", {
            "fields": ("uploaded_at", "file_size"),
            "classes": ("collapse",)
        }),
    )
    
    def thumbnail_preview(self, obj):
        """Display thumbnail in admin list and form."""
        if obj.file:
            return format_html(
                '<img src="{}" style="max-width: 100px; max-height: 100px; border-radius: 4px;" />',
                obj.file.url
            )
        return "No image"
    thumbnail_preview.short_description = "Thumbnail"
    
    def copy_url_action(self, obj):
        """Add copy URL button."""
        if obj.file:
            return format_html(
                '<button type="button" onclick="navigator.clipboard.writeText(\'{}\'); alert(\'URL copied!\')" '
                'style="background: #417690; color: white; border: none; padding: 4px 8px; border-radius: 3px; cursor: pointer;">'
                'Copy URL</button>',
                obj.file.url
            )
        return "No URL"
    copy_url_action.short_description = "Actions"
```

### 3. Create Custom Media Library View

Create `cms/admin_urls.py`:

```python
from django.contrib.admin.views.decorators import staff_member_required
from django.core.paginator import Paginator
from django.db.models import Q, Sum
from django.shortcuts import render
from django.urls import path
from django.utils.decorators import method_decorator
from django.views.generic import ListView

from cms.models import MediaFile

@method_decorator(staff_member_required, name='dispatch')
class MediaLibraryView(ListView):
    """Custom admin view for media library management."""
    model = MediaFile
    template_name = 'admin/media_library_list.html'
    context_object_name = 'media_files'
    paginate_by = 20
    
    def get_queryset(self):
        """Filter media files based on search query."""
        queryset = MediaFile.objects.all()
        search_query = self.request.GET.get('q', '').strip()
        
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(file__icontains=search_query)
            )
        
        return queryset.order_by('-uploaded_at')

# URL patterns for admin
admin_urlpatterns = [
    path('media-library/', MediaLibraryView.as_view(), name='media_library'),
]
```

### 4. Wire Admin URLs

Update `backend/urls.py` to include custom admin URLs:

```python
from cms.admin_urls import admin_urlpatterns

# Add custom admin URLs
for pattern in admin_urlpatterns:
    urlpatterns.insert(-1, path('admin/', include([pattern])))
```

### 5. Update Dashboard Integration

Add media library links to `templates/admin/dashboard.html` in the Quick Actions section:

```html
<div class="quick-actions">
    <!-- existing links -->
    <a href="{% url 'admin:media_library' %}" class="action-link">📁 {% trans 'Media Library' %}</a>
    <a href="{% url 'admin:cms_mediafile_add' %}" class="action-link">📤 {% trans 'Upload Media' %}</a>
    <!-- existing links -->
</div>
```

Update `cms/admin_dashboard.py` to include media statistics:

```python
from cms.models import MediaFile

# Add to content_stats
'media': {
    'total_files': MediaFile.objects.count(),
    'total_size': MediaFile.objects.aggregate(total=Count('file_size'))['total'] or 0,
},
```

### 6. Create API Endpoint

Add MediaFile serializer to `cms/serializers.py`:

```python
class MediaFileSerializer(serializers.ModelSerializer):
    """Serializer for MediaFile API endpoint."""
    url = serializers.SerializerMethodField()
    thumbnail = serializers.SerializerMethodField()
    
    class Meta:
        model = MediaFile
        fields = ("id", "name", "url", "thumbnail", "uploaded_at", "file_size", "get_file_size_display")
        read_only_fields = ("uploaded_at", "file_size")
    
    def get_url(self, obj):
        """Return absolute URL for the media file."""
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None
```

Add API view to `cms/views.py`:

```python
@api_view(["GET"])
def media_list(request: Request) -> Response:
    """
    API endpoint for media files - supports search and filtering.
    
    Query parameters:
    - q: Search query for name or filename
    - folder: Filter by folder path (e.g., 'uploads/page_hero_slides/')
    """
    queryset = MediaFile.objects.all().order_by('-uploaded_at')
    
    # Search functionality
    search_query = request.query_params.get('q', '').strip()
    if search_query:
        queryset = queryset.filter(
            Q(name__icontains=search_query) |
            Q(file__icontains=search_query)
        )
    
    # Folder filtering
    folder_filter = request.query_params.get('folder', '').strip()
    if folder_filter:
        queryset = queryset.filter(file__startswith=folder_filter)
    
    serializer = MediaFileSerializer(queryset, many=True, context={"request": request})
    return Response(serializer.data)
```

Add URL to `cms/urls.py`:

```python
path("media/", views.media_list, name="cms-media-list"),
```

### 7. Run Database Migration

Create and apply the database migration for the new MediaFile model.

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

- http://127.0.0.1:8000/admin/dashboard/ (Media Library links in Quick Actions)
- http://127.0.0.1:8000/admin/cms/mediafile/ (Standard Django admin for media files)
- http://127.0.0.1:8000/admin/media-library/ (Custom media library grid view)
- http://127.0.0.1:8000/admin/cms/mediafile/add/ (Upload new media)
- http://127.0.0.1:8000/api/cms/media/ (API endpoint for media files)
- http://127.0.0.1:8000/api/cms/media/?q=test (Search functionality)
- http://127.0.0.1:8000/api/cms/media/?folder=uploads/ (Folder filtering)

### Testing Workflow

1. **Upload Test Images**: Use the "Upload Media" link from dashboard to add sample images
2. **Browse Media Library**: Access the custom media library view to see thumbnail grid
3. **Test Search**: Use the search bar to find specific media files
4. **Copy URL Feature**: Click "Copy URL" buttons to test clipboard functionality
5. **API Testing**: Access API endpoints to verify JSON responses
6. **Integration Testing**: Use copied URLs in page sections or CTA buttons

## Notes / Pitfalls

### Media File Storage
- Ensure `MEDIA_ROOT` and `MEDIA_URL` are properly configured in Django settings
- The `upload_to="uploads/"` path creates files under `media/uploads/`
- For production, consider using cloud storage services like AWS S3

### Admin Interface Customization
- The custom media library template provides a more user-friendly grid view
- Copy URL functionality uses JavaScript clipboard API with fallbacks for older browsers
- Thumbnail preview is limited to 100px for performance in admin lists

### File Size Management
- File size is automatically calculated and stored during upload
- Human-readable size display handles bytes to TB conversion
- Consider adding file size limits in production environments

### API Security
- The media API endpoint is currently open - add authentication for production
- Consider rate limiting for API endpoints to prevent abuse
- File URLs are absolute URLs that include the full domain

### Performance Considerations
- Media library view uses pagination (20 items per page) to handle large media libraries
- Database queries are optimized with proper ordering and filtering
- Consider adding database indexes on frequently searched fields

### Browser Compatibility
- Copy URL feature includes fallback for browsers without Clipboard API
- Admin templates use modern CSS Grid for responsive layout
- JavaScript functionality degrades gracefully in older browsers

### Integration with Existing Content
- MediaFile model is separate from existing hero image fields
- Editors can use media library URLs in any text field that accepts URLs
- Future enhancement could add direct media picker widgets to admin forms

### File Organization
- All uploads go to `uploads/` directory by default
- API supports folder filtering for better organization
- Consider implementing folder/category system for large media libraries