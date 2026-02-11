from django.contrib import admin
from django.urls import path, re_path, include
from core.health import health_check

urlpatterns = [
    path('admin/', admin.site.urls),
    re_path(r'^api/health/?$', health_check, name='health-check'),
    re_path(r'^api/auth/', include('users.urls')),
    path('', include('django_prometheus.urls')),
]
