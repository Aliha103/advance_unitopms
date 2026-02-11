from django.urls import re_path
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    HostApplicationView,
    LoginView,
    HostProfileView,
    ApplicationListView,
    ApplicationApproveView,
    ApplicationRejectView,
    SetPasswordView,
)

urlpatterns = [
    re_path(r'^host-application/?$', HostApplicationView.as_view(), name='host-application'),
    re_path(r'^login/?$', LoginView.as_view(), name='login'),
    re_path(r'^token/refresh/?$', TokenRefreshView.as_view(), name='token-refresh'),
    re_path(r'^profile/?$', HostProfileView.as_view(), name='host-profile'),

    # Application management (admin)
    re_path(r'^applications/?$', ApplicationListView.as_view(), name='application-list'),
    re_path(r'^applications/(?P<pk>\d+)/approve/?$', ApplicationApproveView.as_view(), name='application-approve'),
    re_path(r'^applications/(?P<pk>\d+)/reject/?$', ApplicationRejectView.as_view(), name='application-reject'),

    # Set password (public — host uses token from approval URL)
    re_path(r'^set-password/?$', SetPasswordView.as_view(), name='set-password'),
]
