from django.urls import path, re_path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import HostApplicationView, LoginView, HostProfileView

urlpatterns = [
    re_path(r'^host-application/?$', HostApplicationView.as_view(), name='host-application'),
    re_path(r'^login/?$', LoginView.as_view(), name='login'),
    re_path(r'^token/refresh/?$', TokenRefreshView.as_view(), name='token-refresh'),
    re_path(r'^profile/?$', HostProfileView.as_view(), name='host-profile'),
]
