from django.contrib import admin
from django.urls import path, include
from core.health import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/health/', health_check, name='health-check'),
    path('api/auth/', include('users.urls')),
    path('', include('django_prometheus.urls')),
]
