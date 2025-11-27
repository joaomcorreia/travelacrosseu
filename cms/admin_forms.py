import json
from django import forms
from django.core.exceptions import ValidationError


class JSONImportForm(forms.Form):
    """Form for uploading JSON file to import CMS model data"""
    
    file = forms.FileField(
        label="JSON File",
        help_text="Select a JSON file containing model data",
        widget=forms.FileInput(attrs={
            'accept': '.json',
            'class': 'vFileUploadField'
        })
    )
    
    def clean_file(self):
        file = self.cleaned_data.get('file')
        
        if not file:
            raise ValidationError("Please select a file to upload.")
        
        # Check file extension
        if not file.name.lower().endswith('.json'):
            raise ValidationError("File must be a JSON file (.json extension).")
        
        # Check file size (max 5MB)
        if file.size > 5 * 1024 * 1024:
            raise ValidationError("File size must be less than 5MB.")
        
        # Try to parse JSON
        try:
            file.seek(0)  # Reset file pointer
            content = file.read()
            
            # Handle both bytes and string content
            if isinstance(content, bytes):
                content = content.decode('utf-8')
            
            data = json.loads(content)
            
            # Validate that it's a list
            if not isinstance(data, list):
                raise ValidationError("JSON file must contain a list of objects.")
            
            # Validate that it's not empty
            if not data:
                raise ValidationError("JSON file cannot be empty.")
            
            # Basic validation - each item should be a dict
            for i, item in enumerate(data):
                if not isinstance(item, dict):
                    raise ValidationError(f"Item {i + 1} must be an object.")
            
            # Store parsed data for later use
            file.seek(0)  # Reset file pointer
            self.parsed_data = data
            
        except json.JSONDecodeError as e:
            raise ValidationError(f"Invalid JSON format: {str(e)}")
        except UnicodeDecodeError:
            raise ValidationError("File encoding must be UTF-8.")
        
        return file
    
    def get_parsed_data(self):
        """Get the parsed JSON data after validation"""
        return getattr(self, 'parsed_data', None)