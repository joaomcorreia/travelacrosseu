@echo off
cd /d C:\projects\travelacrosseu
C:\projects\travelacrosseu\.venv\Scripts\python.exe manage.py shell -c "from core.models import TravelPage; print('Total pages:', TravelPage.objects.count()); print(list(TravelPage.objects.filter(language='en').values('title','country__name','city__name')))"
