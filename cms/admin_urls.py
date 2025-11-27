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
    
    def get_context_data(self, **kwargs):
        """Add additional context for the template."""
        context = super().get_context_data(**kwargs)
        
        # Calculate total file size
        total_size = MediaFile.objects.aggregate(
            total=Sum('file_size')
        )['total'] or 0
        
        # Convert to human-readable format
        context['total_size_display'] = self._format_file_size(total_size)
        
        return context
    
    def _format_file_size(self, size_bytes):
        """Convert bytes to human-readable format."""
        if size_bytes == 0:
            return "0 B"
        
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size_bytes < 1024:
                return f"{size_bytes:.1f} {unit}"
            size_bytes /= 1024
        return f"{size_bytes:.1f} TB"


# URL patterns for admin
admin_urlpatterns = [
    path('media-library/', MediaLibraryView.as_view(), name='media_library'),
]