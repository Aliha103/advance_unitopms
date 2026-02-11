from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import HostApplicationView, LoginView, HostProfileView

urlpatterns = [
    path('host-application/', HostApplicationView.as_view(), name='host-application'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token-refresh'),
    path('profile/', HostProfileView.as_view(), name='host-profile'),
]
